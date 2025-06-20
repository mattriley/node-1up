module.exports = () => arr => {

    return arr.filter((el, i) => i === 0 || el !== arr[i - 1]);

};
