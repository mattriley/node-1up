module.exports = () => max => val => {

    const result = { valid: false, reason: null };

    if (!Array.isArray(val)) {
        result.reason = 'Not an array';
    } else if (val.length < 2 || val.length > 3) {
        result.reason = 'Expected 2 or 3 elements';
    } else if (!val.every(Number.isFinite)) {
        result.reason = 'Non-numeric parts';
    } else {
        const [deg, min, sec = 0] = val;
        const decimal = deg + min / 60 + sec / 3600;
        if (decimal < -max || decimal > max) {
            result.reason = `Out of range: ${decimal}`;
        } else {
            result.valid = true;
        }
    }

    return result;
}
