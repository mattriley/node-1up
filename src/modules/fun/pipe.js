module.exports = ({ self }) => (fns) => {
    let fnList;

    if (Array.isArray(fns)) {
        fnList = fns;
    } else if (typeof fns === 'object' && fns !== null) {
        fnList = Object.values(fns);
    } else {
        throw new TypeError('pipe expects an array or object of functions');
    }

    if (!fnList.every(fn => typeof fn === 'function')) {
        throw new TypeError('All elements in pipe must be functions');
    }

    return (initial, context) => {
        return fnList.reduce((acc, fn) => {
            return self.invokeOrReturn(fn, acc, context);
        }, initial);
    };
};
