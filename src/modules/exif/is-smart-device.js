// smart-or-camera.fast.js
// True = smart device (phone/tablet), false = dedicated camera.

const SMART_MAKES = new Set([
    'apple', 'samsung', 'google', 'xiaomi', 'huawei', 'oneplus',
    'oppo', 'vivo', 'nokia', 'sony', 'motorola', 'lg', 'zte', 'meizu', 'realme', 'asus'
]);

const CAMERA_MAKES = new Set([
    'canon', 'nikon', 'fujifilm', 'panasonic', 'olympus', 'leica', 'pentax', 'ricoh', 'sigma', 'hasselblad'
]);

// single regex per check (case-insensitive)
const MODEL_RE = /(iphone|ipad|pixel|redmi|mi(?:\s|-)|mix\s|xperia|galaxy|moto\s|oneplus|honor|nova|poco|realme|mate|nexus|zenfone)/i;
const SOFT_RE = /(ios|ipad os|android|miui|one ui|coloros|oxygenos|funtouch)/i;

const hasOwn = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k);

// minimal, fast numeric parse
const toNumber = (v) => {
    if (v == null) return NaN;
    if (typeof v === 'number') return v;
    // handles "4.2 mm", "26 mm", etc. parseFloat stops at first non-number
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
};

module.exports = () => ({ exif }) => {
    exif = exif || {};

    // Pull raw once (avoid extra strings/allocs if absent)
    const rawMake = hasOwn(exif, 'Make') ? String(exif.Make) : '';
    const rawModel = hasOwn(exif, 'Model') ? String(exif.Model) : '';
    const rawSoftware = hasOwn(exif, 'Software') ? String(exif.Software) : '';

    const make = rawMake.toLowerCase();

    // 1) Make is a known phone/tablet brand → smart
    if (make && SMART_MAKES.has(make)) return true;

    // 2) Model looks like a phone → smart
    if (rawModel && MODEL_RE.test(rawModel)) return true;

    // 3) Software hints at mobile OS → smart
    if (rawSoftware && SOFT_RE.test(rawSoftware)) return true;

    // 4) Fallback only if GPS exists (skip focal parsing otherwise)
    const hasGps = ('GPSLatitude' in exif) || ('GPSLongitude' in exif) || ('GPSPosition' in exif);
    if (!hasGps) return false;

    // Quick phone-like optics check
    const focalMm = toNumber(exif.FocalLength);                // e.g., "4.2 mm" → 4.2
    const focal35 = toNumber(exif.FocalLengthIn35mmFormat);    // e.g., "26 mm" → 26
    const phoneLikeFocal =
        (Number.isFinite(focalMm) && focalMm < 8) ||
        (Number.isFinite(focal35) && focal35 >= 20 && focal35 <= 35);

    if (!phoneLikeFocal) return false;

    // Not a classic camera brand → smart
    if (make && !CAMERA_MAKES.has(make)) return true;

    return false;
};
