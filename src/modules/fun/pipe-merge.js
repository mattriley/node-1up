const merge = require('lodash.merge');

module.exports = ({ self }) => (fns) => {
    let fnList;

    if (Array.isArray(fns)) {
        fnList = fns;
    } else if (typeof fns === 'object' && fns !== null) {
        fnList = Object.values(fns);
    } else {
        throw new TypeError('merge expects an array or object of functions');
    }

    if (!fnList.every(fn => typeof fn === 'function')) {
        throw new TypeError('All elements in merge must be functions');
    }

    return (initial = {}, context) => {
        return fnList.reduce((acc, fn) => {
            const result = self.invokeOrReturn(fn, acc, context);
            return merge({}, acc, result);
        }, initial);
    };
};
