module.exports = arr => {

    return arr.map((_, i) => arr.slice(0, i + 1));

};
