// is-smart-device.js
// Decide if EXIF looks like a smart device (phone/tablet) vs dedicated camera.
// Uses: cameraMakes (negative list), smartModels ([model, make] pairs), mobileSoftware (positive list).
// Adds cheap positive signal: derivedSmartMakes from smartModels.

const hasOwn = (o, k) => o != null && Object.prototype.hasOwnProperty.call(o, k);

const toNumber = v => {
    if (v == null) { return NaN; }
    if (typeof v === 'number') { return v; }
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
};

const escapeRe = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const compileAlternationRe = list => {
    const items = (Array.isArray(list) ? list : []).map(x => Array.isArray(x) ? x[0] : x).filter(Boolean);
    if (items.length === 0) { return null; }
    const alts = items.map(s => escapeRe(String(s)));
    return new RegExp(`(?:${alts.join('|')})`, 'i');
};

module.exports = ({ config }) => {

    const cameraMakes = new Set((config.exif.cameraMakes || []).map(s => String(s).toLowerCase()));

    // Flatten pairs; also build fast indices
    const modelPairs = (config.exif.smartModels || []).map(([m, mk]) => [String(m).toLowerCase(), String(mk).toLowerCase()]);
    const derivedSmartMakes = new Set(modelPairs.map(([, mk]) => mk)); // cheap positive signal

    const MODEL_RE = compileAlternationRe(config.exif.smartModels || []);
    const SOFT_RE = compileAlternationRe(config.exif.mobileSoftware || []);

    return ({ exif = {} }) => {

        // Normalize: guard against null/undefined exif
        exif = exif || {};

        const rawMake = hasOwn(exif, 'Make') ? String(exif.Make) : '';
        const rawModel = hasOwn(exif, 'Model') ? String(exif.Model) : '';
        const rawSoftware = hasOwn(exif, 'Software') ? String(exif.Software) : '';

        const make = rawMake.toLowerCase();

        // Strong negative: known dedicated camera brand
        if (make && cameraMakes.has(make)) {
            // Allow override ONLY if software clearly indicates a mobile OS/vendor skin.
            // (Do NOT let a model keyword override a camera make on its own.)
            if (rawSoftware && SOFT_RE && SOFT_RE.test(rawSoftware)) {
                return true;
            }
            return false;
        }

        // Cheap positive: Make ∈ derivedSmartMakes
        if (make && derivedSmartMakes.has(make)) {
            return true;
        }

        // Model indicates a smartphone/tablet; accept if Make is absent,
        // consistent, or neutral (not a known camera make and not a known smart make).
        if (rawModel && MODEL_RE && MODEL_RE.test(rawModel)) {
            const lm = rawModel.toLowerCase();
            for (let i = 0; i < modelPairs.length; i += 1) {
                const [modelKey, expectedMake] = modelPairs[i];
                if (lm.includes(modelKey)) {
                    const makeIsNeutral = make && !cameraMakes.has(make) && !derivedSmartMakes.has(make);
                    if (!make || make === expectedMake || makeIsNeutral) {
                        return true;
                    }
                    // Conflicting known camera make stays a veto unless Software overrides.
                    break;
                }
            }
        }

        // Software hint for mobile OS / vendor skin
        if (rawSoftware && SOFT_RE && SOFT_RE.test(rawSoftware)) {
            return true;
        }

        // Fallback: optics + GPS heuristic
        const hasGps = ('GPSLatitude' in exif) || ('GPSLongitude' in exif) || ('GPSPosition' in exif);
        if (!hasGps) {
            return false;
        }

        const focalMm = toNumber(exif.FocalLength);
        const focal35 = toNumber(exif.FocalLengthIn35mmFormat);
        const phoneLikeFocal =
            (Number.isFinite(focalMm) && focalMm < 8) ||
            (Number.isFinite(focal35) && focal35 >= 20 && focal35 <= 35);

        if (!phoneLikeFocal) {
            return false;
        }

        // If GPS + phone-like optics, and Make not in cameraMakes → smart
        return true;

    };

};
