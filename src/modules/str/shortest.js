module.exports = () => arr => {

    if (!arr || !arr.length) return undefined;
    return arr.reduce((a, b) => a.length <= b.length ? a : b);

}
