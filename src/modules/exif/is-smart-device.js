const hasOwn = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k);

// minimal, fast numeric parse
const toNumber = (v) => {
    if (v == null) { return NaN; }
    if (typeof v === 'number') { return v; }
    const n = parseFloat(v); // handles "4.2 mm", "26 mm", etc.
    return Number.isFinite(n) ? n : NaN;
};

// escape a literal to be safe in a regex alternation
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// compile a single case-insensitive regex from an array of literals
const compileListRe = (arr) => {
    const items = Array.isArray(arr) ? arr.filter(Boolean).map(escapeRe) : [];
    if (items.length === 0) { return null; }
    // Keep it simple: an alternation; we *don’t* add word boundaries because many models contain spaces
    return new RegExp(`(?:${items.join('|')})`, 'i');
};

module.exports = ({ config }) => {

    // Precompute lookups & regexes once (avoid per-call allocations)
    const smartMakes = new Set((config.exif.smartMakes || []).map((s) => String(s).toLowerCase()));
    const cameraMakes = new Set((config.exif.cameraMakes || []).map((s) => String(s).toLowerCase()));

    const MODEL_RE = compileListRe(config.exif.smartModels || []);
    const SOFT_RE = compileListRe(config.exif.mobileSoftware || []);

    return ({ exif = {} }) => {

        // Pull raw once (avoid extra strings/allocs if absent)
        const rawMake = hasOwn(exif, 'Make') ? String(exif.Make) : '';
        const rawModel = hasOwn(exif, 'Model') ? String(exif.Model) : '';
        const rawSoftware = hasOwn(exif, 'Software') ? String(exif.Software) : '';

        const make = rawMake.toLowerCase();

        // 1) Make is a known phone/tablet brand → smart
        if (make && smartMakes.has(make)) { return true; }

        // 2) Model looks like a phone → smart
        if (rawModel && MODEL_RE && MODEL_RE.test(rawModel)) { return true; }

        // 3) Software hints at mobile OS → smart
        if (rawSoftware && SOFT_RE && SOFT_RE.test(rawSoftware)) { return true; }

        // 4) Fallback only if GPS exists (skip focal parsing otherwise)
        const hasGps = ('GPSLatitude' in exif) || ('GPSLongitude' in exif) || ('GPSPosition' in exif);
        if (!hasGps) { return false; }

        // Quick phone-like optics check
        const focalMm = toNumber(exif.FocalLength);                // e.g., "4.2 mm" → 4.2
        const focal35 = toNumber(exif.FocalLengthIn35mmFormat);    // e.g., "26 mm" → 26
        const phoneLikeFocal =
            (Number.isFinite(focalMm) && focalMm < 8) ||
            (Number.isFinite(focal35) && focal35 >= 20 && focal35 <= 35);

        if (!phoneLikeFocal) { return false; }

        // Not a classic camera brand → smart
        if (make && !cameraMakes.has(make)) { return true; }

        return false;

    };

};
