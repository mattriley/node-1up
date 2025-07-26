module.exports = () => delimiters => {

    delimiters = [delimiters].flat();
    delimiters = [...delimiters].sort((a, b) => b.length - a.length);
    delimiters = delimiters.map(d => d.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    return new RegExp(`(?:${delimiters.join('|')})`);

};
