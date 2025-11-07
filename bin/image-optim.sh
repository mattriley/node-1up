#!/bin/bash
# Recursively process images with:
# - Resize to max dimension (default 2048px) when needed
# - Convert to HEIC by default when appropriate, EVEN IF already <= MAX
# - Preserve all metadata via exiftool
# - MIME-aware defaults: JPEG->HEIC, PNG->PNG (unless --convert-png), HEIC->HEIC
#
# Flags:
#   --max <pixels>       Longest side cap (default 2048)
#   --dry-run            Preview actions without modifying files
#   --keep-format        Do NOT convert formats (resize only if > MAX)
#   --convert-png        Convert PNG -> HEIC as well
#   --keep-originals     When converting, keep the source file instead of deleting it
#   --log <path>         Write TSV log (default: ./resize-YYYYmmdd-HHMMSS.log)
#   -h|--help            Show help
#
# Log columns (TSV):
#   timestamp  action  path  width  height  longest  from_ext  to_ext  before_bytes  after_bytes  note
#
# Supported inputs: JPG, JPEG, PNG, HEIC (extend the find filter as needed)

set -euo pipefail

# ---- Defaults ----
MAX=2048
DRY_RUN=0
KEEP_FORMAT=0
CONVERT_PNG=0
KEEP_ORIGINALS=0
LOGFILE="resize-$(date +%Y%m%d-%H%M%S).log"
USE_LOG=1

# ---- Parse flags ----
while [[ $# -gt 0 ]]; do
  case "$1" in
    --max) MAX="$2"; shift 2;;
    --dry-run) DRY_RUN=1; shift;;
    --keep-format|--no-heic) KEEP_FORMAT=1; shift;;
    --convert-png) CONVERT_PNG=1; shift;;
    --keep-originals) KEEP_ORIGINALS=1; shift;;
    --log) LOGFILE="$2"; USE_LOG=1; shift 2;;
    -h|--help)
      echo "Usage: $0 [--max <pixels>] [--dry-run] [--keep-format] [--convert-png] [--keep-originals] [--log <path>]"
      exit 0;;
    *) echo "Unknown option: $1" >&2; exit 1;;
  esac
done

if ! command -v exiftool >/dev/null 2>&1; then
  echo "❌ exiftool not found. Install: brew install exiftool" >&2
  exit 1
fi

# ---- Helpers ----
ts() { date '+%Y-%m-%d %H:%M:%S'; }
fsize() { stat -f %z "$1" 2>/dev/null || wc -c <"$1" 2>/dev/null || echo 0; }
hsize() {
  local bytes=${1:-0} unit="B" num=$bytes
  [[ $bytes -ge 1099511627776 ]] && unit="TB" && num=$(awk "BEGIN{printf \"%.2f\", $bytes/1099511627776}")
  [[ $bytes -ge 1073741824 && $bytes -lt 1099511627776 ]] && unit="GB" && num=$(awk "BEGIN{printf \"%.2f\", $bytes/1073741824}")
  [[ $bytes -ge 1048576 && $bytes -lt 1073741824 ]] && unit="MB" && num=$(awk "BEGIN{printf \"%.2f\", $bytes/1048576}")
  [[ $bytes -ge 1024 && $bytes -lt 1048576 ]] && unit="KB" && num=$(awk "BEGIN{printf \"%.2f\", $bytes/1024}")
  echo "${num}${unit}"
}
log_header() {
  [[ $USE_LOG -eq 1 ]] || return 0
  if [[ ! -f "$LOGFILE" ]]; then
    printf "timestamp\taction\tpath\twidth\theight\tlongest\tfrom_ext\tto_ext\tbefore_bytes\tafter_bytes\tnote\n" >"$LOGFILE"
  fi
}
log_line() {
  [[ $USE_LOG -eq 1 ]] || return 0
  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
    "$(ts)" "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8" "${9}" "${10}" >>"$LOGFILE"
}

# ---- Confirmation ----
echo "Log file: $LOGFILE"
log_header

if [[ $DRY_RUN -eq 0 ]]; then
  if [[ $KEEP_FORMAT -eq 1 ]]; then
    echo "⚠️  Will RESIZE to ≤ ${MAX}px (if needed) and overwrite originals (format unchanged)."
  else
    echo "⚠️  Will RESIZE to ≤ ${MAX}px if needed, and CONVERT to HEIC when policy says so"
    echo "    (JPEG→HEIC by default; PNG→HEIC only with --convert-png), even if already ≤ ${MAX}px."
    [[ $KEEP_ORIGINALS -eq 1 ]] && echo "ℹ️  --keep-originals: originals will be retained when converting."
  fi
  read -p "Proceed? (y/N): " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Cancelled."; exit 1; }
else
  echo "🔍 Dry-run mode — no files will be modified."
fi

# ---- Counters ----
resized=0
skipped=0
converted=0
errors=0
bytes_before_total=0
bytes_after_total=0

# ---- Process files ----
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' \) -print0 |
while IFS= read -r -d '' file; do
  if [[ ! -s "$file" || ! -r "$file" || ! -w "$file" ]]; then
    echo "⏭️  Skipping (permissions/empty): $file"
    log_line "skip" "$file" "" "" "" "" "" "" "" "permissions/empty"
    ((skipped++)) || true
    continue
  fi

  # Dimensions (orientation-aware)
  size_str=$(exiftool -s3 -Composite:ImageSize "$file" 2>/dev/null || echo "")
  if [[ -z "$size_str" || "$size_str" != *x* ]]; then
    echo "⚠️  Could not read dimensions, skipping: $file"
    log_line "skip" "$file" "" "" "" "" "" "" "" "no-dimensions"
    ((skipped++)) || true
    continue
  fi
  width=${size_str%x*}; height=${size_str#*x}
  width=${width%% *}; height=${height%% *}
  longest=$(( width > height ? width : height ))
  before_bytes=$(fsize "$file")
  from_ext=$(echo "${file##*.}" | tr '[:upper:]' '[:lower:]')
  dir=$(dirname "$file"); base=$(basename "$file"); stem="${base%.*}"

  # MIME and target extension per policy
  mime=$(exiftool -s3 -MIMEType "$file" 2>/dev/null || echo "")
  to_ext="$from_ext"
  if [[ $KEEP_FORMAT -eq 0 ]]; then
    case "$mime" in
      image/jpeg) to_ext="heic" ;;
      image/png)  to_ext=$([[ $CONVERT_PNG -eq 1 ]] && echo "heic" || echo "png") ;;
      image/heic|image/heif) to_ext="heic" ;;
      *) to_ext="$from_ext" ;;
    esac
  fi

  # Decide operation:
  # - Need resize? (longest > MAX)
  # - Need convert? (to_ext != from_ext)
  need_resize=$(( longest > MAX ? 1 : 0 ))
  need_convert=$([[ "$to_ext" != "$from_ext" ]] && echo 1 || echo 0)

  # If neither resize nor convert is needed, skip
  if [[ $need_resize -eq 0 && $need_convert -eq 0 ]]; then
    echo "✓ No change: $file (${width}x${height}, $from_ext)"
    log_line "skip" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "$before_bytes" "no-op"
    ((skipped++)) || true
    continue
  fi

  # Build paths and action label
  if [[ $need_convert -eq 1 ]]; then
    final="$dir/${stem}.${to_ext}"
    tmp="$dir/.${stem}.${to_ext}.tmp"
  else
    final="$file"
    tmp="$dir/.${base}.tmp"
  fi

  action=""; note=""
  if [[ $need_resize -eq 1 && $need_convert -eq 1 ]]; then
    action="resize+convert"
  elif [[ $need_resize -eq 1 ]]; then
    action="resize"
  else
    action="convert"
  fi

  echo "→ ${action}: $file (${width}x${height} → $([[ $need_resize -eq 1 ]] && echo "≤ ${MAX}" || echo "same")) [$from_ext → $to_ext]"
  ((resized++)) || true
  [[ $need_convert -eq 1 ]] && ((converted++)) || true

  if [[ $DRY_RUN -eq 1 ]]; then
    log_line "${action}(dry)" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "" "dry-run"
    continue
  fi

  rm -f "$tmp"

  # Execute with sips:
  # - resize+convert: resample + format set
  # - resize only   : resample, keep format
  # - convert only  : format set, no resample
  if [[ $need_resize -eq 1 && $need_convert -eq 1 ]]; then
    if ! sips -s format "$to_ext" --resampleHeightWidthMax "$MAX" "$file" --out "$tmp" >/dev/null; then
      echo "❌ sips failed (resize+convert): $file"
      log_line "error" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "" "sips-resize-convert-failed"
      rm -f "$tmp"; ((errors++)) || true; continue
    fi
  elif [[ $need_resize -eq 1 ]]; then
    if ! sips --resampleHeightWidthMax "$MAX" "$file" --out "$tmp" >/dev/null; then
      echo "❌ sips failed (resize): $file"
      log_line "error" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "" "sips-resize-failed"
      rm -f "$tmp"; ((errors++)) || true; continue
    fi
  else
    # convert only (no resize)
    if ! sips -s format "$to_ext" "$file" --out "$tmp" >/dev/null; then
      echo "❌ sips failed (convert-only): $file"
      log_line "error" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "" "sips-convert-failed"
      rm -f "$tmp"; ((errors++)) || true; continue
    fi
  fi

  # Copy ALL metadata back
  if ! exiftool -quiet -overwrite_original -TagsFromFile "$file" -all:all "$tmp"; then
    echo "❌ exiftool metadata copy failed on: $file"
    log_line "error" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "" "exiftool-failed"
    rm -f "$tmp"; ((errors++)) || true; continue
  fi

  # Finalise
  mv -f "$tmp" "$final"
  after_bytes=$(fsize "$final")
  bytes_before_total=$(( bytes_before_total + before_bytes ))
  bytes_after_total=$(( bytes_after_total + after_bytes ))

  # Handle original deletion if converting
  if [[ $need_convert -eq 1 && "$final" != "$file" && $KEEP_ORIGINALS -eq 0 ]]; then
    rm -f "$file"
  fi

  echo "   ✅ $(hsize "$before_bytes") → $(hsize "$after_bytes")"
  log_line "$action" "$file" "$width" "$height" "$longest" "$from_ext" "$to_ext" "$before_bytes" "$after_bytes" "$note"
done

echo "—"
echo "✅ Finished."
echo "   Resized (incl. convert-only counted): $resized"
echo "   Skipped : $skipped"
echo "   Converted (format changes counted): $converted"
echo "   Errors  : $errors"
if [[ $DRY_RUN -eq 0 ]]; then
  echo "   Size total: $(hsize "$bytes_before_total") → $(hsize "$bytes_after_total")  (saved $(hsize $(( bytes_before_total - bytes_after_total ))))"
else
  echo "   (Dry-run mode: no files modified)"
fi
[[ $USE_LOG -eq 1 ]] && echo "📄 Log written to: $LOGFILE"
