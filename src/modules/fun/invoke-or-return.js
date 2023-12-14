module.exports = ({ f }) => (val, ...args) => {

    return val && f.isPlainFunction(val) ? val(...args) : val;

};
