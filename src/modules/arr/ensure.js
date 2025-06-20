// Optimised on 21 June 2025.

module.exports = ({ config }) => (val, delimiter = config.delimiter) => {

    if (val == null) return []; // handles null and undefined

    if (Array.isArray(val)) return val;

    return val
        .toString()
        .split(delimiter)
        .map(s => s.trim())
        .filter(Boolean);

};
