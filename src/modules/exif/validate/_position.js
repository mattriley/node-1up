module.exports = () => max => val => {

    const result = { valid: false, reason: null };

    if (typeof val === 'number') {
        // Transformed decimal format
        if (!Number.isFinite(val)) {
            result.reason = 'Not a finite number';
        } else if (val < -max || val > max) {
            result.reason = `Out of range: ${val}`;
        } else {
            result.valid = true;
        }
    } else if (Array.isArray(val)) {
        // Raw DMS array format
        if (val.length < 2 || val.length > 3) {
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
    } else {
        result.reason = 'Invalid input type';
    }

    return result;
};
