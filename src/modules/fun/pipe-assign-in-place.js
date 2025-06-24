module.exports = ({ self }) => (fns, stateName = 'state') => {

    const isArray = Array.isArray(fns);
    const isObject = !isArray && typeof fns === 'object' && fns !== null;

    if (!isArray && !isObject) {
        throw new TypeError('pipeAssign expects an array or object of functions');
    }

    const fnList = isArray ? fns : Object.values(fns);

    for (let i = 0; i < fnList.length; i++) {
        if (typeof fnList[i] !== 'function') {
            throw new TypeError('All elements in pipeAssign must be functions');
        }
    }

    return (initial = {}, context = {}) => {
        const state = initial;
        const param = { [stateName]: state, state, context };

        for (let i = 0; i < fnList.length; i++) {
            const result = self.invokeOrReturn(fnList[i], param, state);
            if (result && typeof result === 'object') {
                Object.assign(state, result);
            }
        }

        return state;
    };

};
