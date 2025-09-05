// smart-or-camera.js
// Decide if EXIF looks like a smart device (phone/tablet) vs dedicated camera,
// using only cameraMakes (negative list), smartModels ([model, make] pairs), and mobileSoftware.
// Adds a cheap positive signal: accept when Make ∈ derivedSmartMakes.

const hasOwn = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k);

const toNumber = (v) => {
    if (v == null) { return NaN; }
    if (typeof v === 'number') { return v; }
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
};

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const compileAlternationRe = (list) => {
    const items = (Array.isArray(list) ? list : []).map((x) => Array.isArray(x) ? x[0] : x).filter(Boolean);
    if (items.length === 0) { return null; }
    const alts = items.map((s) => escapeRe(String(s)));
    return new RegExp(`(?:${alts.join('|')})`, 'i');
};

module.exports = ({ config }) => {

    const cameraMakes = new Set((config.exif.cameraMakes || []).map((s) => String(s).toLowerCase()));

    // Flatten pairs; also build fast indices
    const modelPairs = (config.exif.smartModels || []).map(([m, mk]) => [String(m).toLowerCase(), String(mk).toLowerCase()]);
    const derivedSmartMakes = new Set(modelPairs.map(([, mk]) => mk)); // cheap positive signal

    const MODEL_RE = compileAlternationRe(config.exif.smartModels || []);
    const SOFT_RE = compileAlternationRe(config.exif.mobileSoftware || []);

    return ({ exif = {} }) => {

        const rawMake = hasOwn(exif, 'Make') ? String(exif.Make) : '';
        const rawModel = hasOwn(exif, 'Model') ? String(exif.Model) : '';
        const rawSoftware = hasOwn(exif, 'Software') ? String(exif.Software) : '';

        const make = rawMake.toLowerCase();

        // Strong negative first: known dedicated camera brand
        if (make && cameraMakes.has(make)) { return false; }

        // Cheap positive: if Make is one of the derived smart makes, accept quickly
        if (make && derivedSmartMakes.has(make)) { return true; }

        // Model indicates a smartphone/tablet; accept if make is absent or consistent
        if (rawModel && MODEL_RE && MODEL_RE.test(rawModel)) {
            const lm = rawModel.toLowerCase();
            for (let i = 0; i < modelPairs.length; i += 1) {
                const [modelKey, expectedMake] = modelPairs[i];
                if (lm.includes(modelKey)) {
                    if (!make || make === expectedMake) {
                        return true;
                    }
                    // Conflicting make → defer to other signals
                    break;
                }
            }
        }

        // Software hint for mobile OS / vendor skin
        if (rawSoftware && SOFT_RE && SOFT_RE.test(rawSoftware)) { return true; }

        // Fallback: optics + GPS heuristic (only if GPS exists)
        const hasGps = ('GPSLatitude' in exif) || ('GPSLongitude' in exif) || ('GPSPosition' in exif);
        if (!hasGps) { return false; }

        const focalMm = toNumber(exif.FocalLength);
        const focal35 = toNumber(exif.FocalLengthIn35mmFormat);
        const phoneLikeFocal =
            (Number.isFinite(focalMm) && focalMm < 8) ||
            (Number.isFinite(focal35) && focal35 >= 20 && focal35 <= 35);

        if (!phoneLikeFocal) { return false; }

        // GPS present + phone-like optics, and not a known camera brand
        return true;

    };

};
