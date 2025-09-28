// parseDms.js

const HEMISPHERE = { N: 1, S: -1, E: 1, W: -1 };

const normalise = s => String(s)
    .replace(/[º°]/g, '°')
    .replace(/[’′]/g, "'")
    .replace(/[”″]/g, '"')
    .replace(/\bdeg\b/gi, '°')
    .replace(/\s+/g, ' ')
    .trim();

const partsToDecimal = ({ deg = 0, min = 0, sec = 0, sign = 1 }) => {
    const d = Math.abs(Number(deg));
    const m = Math.abs(Number(min)) || 0;
    const s = Math.abs(Number(sec)) || 0;
    let dec = d + m / 60 + s / 3600;
    return sign * dec;
};

function parseOne(str) {
    const s = normalise(str);

    let sign = 1;
    const hemiMatch = s.match(/[NSEW]/i);
    if (hemiMatch) sign = HEMISPHERE[hemiMatch[0].toUpperCase()];

    if (/-\d/.test(s)) sign = -1;

    const nums = s.match(/-?\d+(?:\.\d+)?/g);
    if (!nums || !nums.length) throw new Error('Invalid coordinate: ' + str);

    // Decimal degrees only
    if (nums.length === 1 && !/[°'"]/.test(s)) {
        const dec = Number(nums[0]);
        if (!Number.isFinite(dec)) throw new Error('Invalid number: ' + str);
        return { deg: Math.abs(dec), min: 0, sec: 0, sign: dec < 0 ? -1 : sign };
    }

    // DMS
    const [deg, min, sec] = nums.map(Number);
    return { deg, min, sec, sign };
}

/**
 * Parse a coordinate string into decimal lat/lon.
 * Supports DMS, decimal with hemisphere, and plain decimal.
 * @param {string} str e.g. "37°49′4.49″S, 145°13′46.83″E" or "-37.818, 145.229675"
 * @returns {{ latitude: number, longitude: number }}
 */
function parseDms(str) {
    if (!str) throw new Error('Empty coordinate string');

    const parts = str.split(/\s*,\s*/);
    if (parts.length !== 2) throw new Error('Expected "lat, lon" in: ' + str);

    const lat = partsToDecimal(parseOne(parts[0]));
    const lon = partsToDecimal(parseOne(parts[1]));

    if (Math.abs(lat) > 90) throw new Error('Latitude out of range: ' + lat);
    if (Math.abs(lon) > 180) throw new Error('Longitude out of range: ' + lon);

    return { latitude: lat, longitude: lon };
}

module.exports = parseDms;
