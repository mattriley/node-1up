module.exports = () => val => {

    if (typeof val !== 'string') {
        return { valid: false, reason: 'Not a string' };
    }

    if (!/^\d{4}:\d{2}:\d{2}$/.test(val)) {
        return { valid: false, reason: 'Incorrect format (expected YYYY:MM:DD)' };
    }

    if (val === '0000:00:00') {
        return { valid: false, reason: 'All-zero date' };
    }

    const [year, month, day] = val.split(':').map(Number);

    if (year < 1900 || year > 2100) {
        return { valid: false, reason: `Unrealistic year: ${year}` };
    }

    if (month < 1 || month > 12) {
        return { valid: false, reason: `Invalid month: ${month}` };
    }

    if (day < 1 || day > 31) {
        return { valid: false, reason: `Invalid day: ${day}` };
    }

    return { valid: true };
}
