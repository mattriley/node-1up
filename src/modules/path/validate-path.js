const os = require("os");
const path = require("path");

const ERROR_CODES = {
    EMPTY_STRING: "EMPTY_STRING",
    NULL_BYTE: "NULL_BYTE",
    TOTAL_TOO_LONG: "TOTAL_TOO_LONG",
    SEGMENT_TOO_LONG: "SEGMENT_TOO_LONG",
    INVALID_CHAR: "INVALID_CHAR",
    RESERVED_NAME: "RESERVED_NAME"
};

const BYTE_LEN = (s) => Buffer.byteLength(s, "utf8");
const normalizeFsType = (t) => (t || "").toLowerCase().replace(/\s+/g, "");

module.exports = ({ self }) => {

    /**
     * Resolve which limits to use.
     * Priority:
     *  1) assumeLimits (explicit numeric limits)
     *  2) assumeFs (string FS type lookup)
     *  3) auto-detect based on path
     */
    const resolveLimits = async ({ assumeLimits, assumeFs, forPath }) => {
        if (assumeLimits && typeof assumeLimits === "object") {
            const { nameMax, pathMax, units } = assumeLimits;
            return {
                fsType: assumeLimits.fsType || "custom",
                nameMax: Number(nameMax),
                pathMax: Number(pathMax),
                units: units === "bytes" ? "bytes" : "chars"
            };
        }
        if (assumeFs && typeof assumeFs === "string") {
            const key = normalizeFsType(assumeFs);
            const limits = self.FS_LIMITS[key];
            if (limits) return { fsType: key, ...limits };
            // unknown string → fall back to platform defaults but keep the label
            const def = self.PLATFORM_DEFAULTS[os.platform()];
            return { ...def, fsType: key };
        }
        return self.detectFileSystem(path.dirname(path.resolve(forPath || ".")));
    };

    /**
     * Validate a path using either assumed limits or auto-detected FS.
     * Options:
     *  - assumeFs: string filesystem id (e.g. "apfs", "ext4", "ntfs")
     *  - assumeLimits: { nameMax, pathMax, units: "bytes"|"chars", fsType? }
     *  - longPaths: boolean (Windows-only relaxation to ~32k; you must still use \\?\ paths in practice)
     */
    return async (filePath, { assumeFs, assumeLimits, longPaths = false } = {}) => {
        if (typeof filePath !== "string" || filePath.trim() === "") {
            return { valid: false, code: ERROR_CODES.EMPTY_STRING, reason: "Path must be a non-empty string" };
        }
        if (filePath.includes("\0")) {
            return { valid: false, code: ERROR_CODES.NULL_BYTE, reason: "Path contains null byte" };
        }

        const fsInfo = await resolveLimits({ assumeFs, assumeLimits, forPath: filePath });
        const { nameMax, pathMax, units } = fsInfo;

        // Windows long-path relaxation (validator only)
        let effectivePathMax = pathMax;
        if (os.platform() === "win32" && longPaths) {
            effectivePathMax = 32767; // theoretical API limit for \\?\ paths
        }

        const measure = (s) => (units === "bytes" ? BYTE_LEN(s) : s.length);

        // Total length (use absolute to avoid surprises)
        const absolute = path.resolve(filePath);
        const totalLen = measure(absolute);
        if (totalLen > effectivePathMax) {
            return {
                valid: false,
                code: ERROR_CODES.TOTAL_TOO_LONG,
                reason: `Path exceeds maximum (${totalLen} > ${effectivePathMax} ${units})`,
                fs: fsInfo
            };
        }

        // Per-segment length
        const splitter = os.platform() === "win32" ? /[\\/]+/ : /\/+/;
        const segments = filePath.split(splitter).filter(Boolean);

        for (const seg of segments) {
            const segLen = measure(seg);
            if (segLen > nameMax) {
                return {
                    valid: false,
                    code: ERROR_CODES.SEGMENT_TOO_LONG,
                    reason: `Path segment too long (${segLen} > ${nameMax} ${units}): "${seg}"`,
                    fs: fsInfo
                };
            }
        }

        // Windows-only extra checks (only enforce when actually running on Windows)
        if (os.platform() === "win32") {
            const INVALID_CHARS = /[<>:"/\\|?*]/;
            for (const seg of segments) {
                if (INVALID_CHARS.test(seg)) {
                    return {
                        valid: false,
                        code: ERROR_CODES.INVALID_CHAR,
                        reason: `Invalid character in segment on Windows: "${seg}"`,
                        fs: fsInfo
                    };
                }
            }
            const RESERVED = new Set([
                "CON", "PRN", "AUX", "NUL",
                "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
                "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
            ]);
            for (const seg of segments) {
                const base = seg.split(".")[0].toUpperCase();
                if (RESERVED.has(base)) {
                    return {
                        valid: false,
                        code: ERROR_CODES.RESERVED_NAME,
                        reason: `Reserved device name on Windows: "${base}"`,
                        fs: fsInfo
                    };
                }
            }
        }

        return { valid: true, fs: fsInfo };
    };
};
