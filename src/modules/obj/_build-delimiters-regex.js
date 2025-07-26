module.exports = () => delimiters => {

    const delimiterList = delimiters.map(d => d.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    return new RegExp(`(?:${delimiterList.join('|')})`);

};
