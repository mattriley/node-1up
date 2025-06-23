module.exports = ({ self }) => (fns) => {
    let fnList;

    if (Array.isArray(fns)) {
        fnList = fns;
    } else if (typeof fns === 'object' && fns !== null) {
        fnList = Object.values(fns);
    } else {
        throw new TypeError('asyncChain expects an array or object of functions');
    }

    if (!fnList.every(fn => typeof fn === 'function')) {
        throw new TypeError('All elements in asyncChain must be functions');
    }

    return async (initial = {}, context) => {
        let acc = initial;

        for (const fn of fnList) {
            const result = await self.invokeOrReturn(fn, acc, context);
            if (result !== undefined) {
                acc = result;
            }
        }

        return acc;
    };
};
