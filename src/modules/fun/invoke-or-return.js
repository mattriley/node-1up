module.exports = ({ self }) => (val, ...args) => {

    return val && self.isPlainFunction(val) ? val(...args) : val;

};
