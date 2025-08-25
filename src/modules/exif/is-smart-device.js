const DEFAULT_SMART_MAKES = [
    'apple', 'samsung', 'google', 'xiaomi', 'huawei', 'oneplus',
    'oppo', 'vivo', 'nokia', 'sony', 'motorola', 'lg', 'zte', 'meizu', 'realme', 'asus'
];

const DEFAULT_MODEL_KEYWORDS = [
    // common phone model tokens
    'iphone', 'ipad', 'pixel', 'redmi', 'mi ', 'mi-', 'mix ', 'xperia', 'galaxy', 'moto ', 'oneplus', 'honor',
    'nova', 'poco', 'realme', 'mate', 'nexus', 'zenfone'
];

// OS / software hints often present in EXIF Software tag
const DEFAULT_SOFTWARE_OS_HINTS = [
    'ios', 'ipad os', 'android', 'miui', 'one ui', 'coloros', 'oxygenos', 'funtouch'
];

// Brands typically associated with *regular* cameras; used to down-weight false positives
const REGULAR_CAMERA_MAKES = [
    'canon', 'nikon', 'fujifilm', 'panasonic', 'olympus', 'leica', 'pentax', 'ricoh', 'sigma', 'hasselblad'
];

// Thresholds (tuneable)
const SCORE_THRESHOLD = 5; // final classification threshold
const FOCAL_SMALL_MM_1 = 8; // phones commonly 1.5–7mm actual focal length
const FOCAL_SMALL_MM_2 = 6; // stronger signal if < 6mm
const FOCAL_EQ_MIN = 20;    // 35mm-eq in 20–35mm range is common for phone main cameras
const FOCAL_EQ_MAX = 35;

module.exports = ({ config }) => ({ exif }) => {

    const SMART_DEVICE_MAKES = (config.smartDeviceMakes || DEFAULT_SMART_MAKES).map(s => s.toLowerCase());
    const SMART_MODEL_KEYWORDS = (config.smartModelKeywords || DEFAULT_MODEL_KEYWORDS).map(s => s.toLowerCase());
    const SOFTWARE_OS_HINTS = (config.softwareOsHints || DEFAULT_SOFTWARE_OS_HINTS).map(s => s.toLowerCase());
    const DOWNWEIGHT_REGULAR_MAKES = (config.regularCameraMakes || REGULAR_CAMERA_MAKES).map(s => s.toLowerCase());
    const THRESHOLD = config.threshold || SCORE_THRESHOLD;

    const has = (k) => exif && (k in exif) && exif[k] != null;

    const rawMake = has('Make') ? String(exif.Make) : '';
    const rawModel = has('Model') ? String(exif.Model) : '';
    const rawLensModel = has('LensModel') ? String(exif.LensModel) : '';
    const rawSoftware = has('Software') ? String(exif.Software) : '';

    const make = rawMake.toLowerCase();
    const model = rawModel.toLowerCase();
    const lensModel = rawLensModel.toLowerCase();
    const software = rawSoftware.toLowerCase();

    // Focal length (actual) may come as "4.25 mm" or numeric; coerce safely
    const focalLength = has('FocalLength')
        ? Number(String(exif.FocalLength).replace(/[^0-9.]+/g, '')) // e.g., "4.2 mm" -> 4.2
        : NaN;

    // 35mm equivalent may be a string like "26 mm" or a number
    const focalLengthEq = has('FocalLengthIn35mmFormat')
        ? Number(String(exif.FocalLengthIn35mmFormat).replace(/[^0-9.]+/g, ''))
        : NaN;

    // GPS often present on phones (not definitive)
    const hasGps = ('GPSLatitude' in exif) || ('GPSLongitude' in exif) || ('GPSPosition' in exif);

    // ----- Scoring -----
    let score = 0;
    const reasons = [];

    // 1) Strong: Make matches known smart-device brands
    if (make && SMART_DEVICE_MAKES.includes(make)) {
        score += 4;
        reasons.push(`make "${rawMake}" matches smart-device makes (+4)`);
    }

    // 2) Strong: Model contains common phone keywords
    if (model && SMART_MODEL_KEYWORDS.some(k => model.includes(k))) {
        score += 3;
        reasons.push(`model "${rawModel}" contains phone keyword (+3)`);
    }

    // 3) Moderate: Software hints at mobile OS or vendor pipeline
    if (software && SOFTWARE_OS_HINTS.some(k => software.includes(k))) {
        score += 2;
        reasons.push(`software "${rawSoftware}" hints at mobile OS (+2)`);
    }

    // 4) Focal length (actual) very small -> phone-like optics
    if (!Number.isNaN(focalLength)) {
        if (focalLength < FOCAL_SMALL_MM_2) {
            score += 3;
            reasons.push(`focalLength ${focalLength}mm < ${FOCAL_SMALL_MM_2}mm (+3)`);
        } else if (focalLength < FOCAL_SMALL_MM_1) {
            score += 2;
            reasons.push(`focalLength ${focalLength}mm < ${FOCAL_SMALL_MM_1}mm (+2)`);
        }
    }

    // 5) 35mm equivalent in typical phone-main range (~24–28mm; we allow 20–35 for coverage)
    if (!Number.isNaN(focalLengthEq) && focalLengthEq >= FOCAL_EQ_MIN && focalLengthEq <= FOCAL_EQ_MAX) {
        score += 2;
        reasons.push(`35mm-eq ${focalLengthEq}mm in ${FOCAL_EQ_MIN}-${FOCAL_EQ_MAX}mm range (+2)`);
    }

    // 6) LensModel hints (many phones expose "iPhone back camera", "front camera", etc.)
    const LENS_HINTS = ['front camera', 'back camera', 'wide camera', 'ultra wide', 'telephoto', 'macro'];
    if (lensModel && (
        SMART_MODEL_KEYWORDS.some(k => lensModel.includes(k)) || LENS_HINTS.some(k => lensModel.includes(k))
    )) {
        score += 2;
        reasons.push(`lensModel "${rawLensModel}" looks phone-like (+2)`);
    }

    // 7) GPS presence (weak positive)
    if (hasGps) {
        score += 1;
        reasons.push('GPS tags present (+1)');
    }

    // 8) Down-weight: explicit regular-camera brands in Make
    if (make && DOWNWEIGHT_REGULAR_MAKES.includes(make)) {
        score -= 3;
        reasons.push(`make "${rawMake}" matches regular-camera brands (-3)`);
    }

    // 9) Down-weight: very large actual focal lengths (typical of interchangeable-lens cameras)
    if (!Number.isNaN(focalLength) && focalLength >= 20) {
        score -= 2;
        reasons.push(`focalLength ${focalLength}mm unusually large for phones (-2)`);
    }

    // 10) Down-weight: very long 35mm-eq (e.g., > 200mm) suggests optical zoom lens
    if (!Number.isNaN(focalLengthEq) && focalLengthEq >= 200) {
        score -= 2;
        reasons.push(`35mm-eq ${focalLengthEq}mm very long (-2)`);
    }

    // ----- Decision -----
    const isSmartDevice = score >= THRESHOLD;

    return isSmartDevice;

    // return {
    //     isSmartDevice,
    //     score,
    //     threshold: THRESHOLD,
    //     reasons,
    //     inferred: {
    //         make: rawMake || null,
    //         model: rawModel || null,
    //         lensModel: rawLensModel || null,
    //         software: rawSoftware || null,
    //         focalLengthMm: Number.isNaN(focalLength) ? null : focalLength,
    //         focalLength35mmEq: Number.isNaN(focalLengthEq) ? null : focalLengthEq,
    //         hasGps: !!hasGps
    //     }
    // };
};
