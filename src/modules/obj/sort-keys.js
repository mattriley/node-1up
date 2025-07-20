module.exports = ({ self }) => obj => {

    if (!self.isPlain(obj)) return obj;
    const entries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));
    return Object.fromEntries(entries);

};
