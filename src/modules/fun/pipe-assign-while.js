module.exports = ({ self }) => (fns) => {
    let fnList;

    if (Array.isArray(fns)) {
        fnList = fns;
    } else if (typeof fns === 'object' && fns !== null) {
        fnList = Object.values(fns);
    } else {
        throw new TypeError('conditionalAssign expects an array or object of functions');
    }

    if (!fnList.every(fn => typeof fn === 'function')) {
        throw new TypeError('All elements in conditionalAssign must be functions');
    }

    return (predicate, initial = {}, context) => {
        return fnList.reduce((acc, fn) => {
            if (predicate(acc)) {
                const result = self.invokeOrReturn(fn, acc, context);
                return { ...acc, ...result };
            }
            return acc;
        }, initial);
    };
};
