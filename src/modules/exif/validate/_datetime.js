module.exports = () => val => {

    const result = { valid: false, reason: null };

    if (typeof val !== 'string') {
        result.reason = 'Not a string';
        return result;
    }

    if (/^(0000:00:00|1970:01:01)/.test(val)) {
        result.reason = 'Placeholder or invalid default date';
        return result;
    }

    const match = val.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (!match) {
        result.reason = 'Incorrect format, expected "YYYY:MM:DD HH:MM:SS"';
        return result;
    }

    const [, y, mo, d, h, m, s] = match.map(Number);

    const isValid = (
        y >= 1900 &&
        mo >= 1 && mo <= 12 &&
        d >= 1 && d <= 31 &&
        h >= 0 && h <= 23 &&
        m >= 0 && m <= 59 &&
        s >= 0 && s <= 59
    );

    if (!isValid) {
        result.reason = `Date parts out of valid range: ${val}`;
        return result;
    }

    result.valid = true;
    return result;
};
