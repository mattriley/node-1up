const invokeOrReturn = require('./invoke-or-return');

module.exports = ({ self }) => (funs, ...args) => {

    return Object.values(funs).map(fun => self.invokeOrReturn(fun, ...args));

};
