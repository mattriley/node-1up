module.exports = ({ is }) => (val, ...args) => {

    return val && is.plainFunction(val) ? val(...args) : val;

};
