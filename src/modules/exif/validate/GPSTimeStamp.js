module.exports = () => val => {

    if (!Array.isArray(val)) {
        return { valid: false, reason: 'Must be an array' };
    }

    if (val.length !== 3) {
        return { valid: false, reason: 'Must have exactly 3 elements (HH, MM, SS)' };
    }

    const [hh, mm, ss] = val;

    if (
        typeof hh !== 'number' || isNaN(hh) ||
        typeof mm !== 'number' || isNaN(mm) ||
        typeof ss !== 'number' || isNaN(ss)
    ) {
        return { valid: false, reason: 'All elements must be valid numbers' };
    }

    if (hh < 0 || hh > 23) {
        return { valid: false, reason: `Invalid hour: ${hh}` };
    }

    if (mm < 0 || mm > 59) {
        return { valid: false, reason: `Invalid minutes: ${mm}` };
    }

    if (ss < 0 || ss >= 60) {
        return { valid: false, reason: `Invalid seconds: ${ss}` };
    }

    return { valid: true };
}
