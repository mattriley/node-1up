module.exports = ({ self }) => (fns) => {

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

    return (initial = {}, context) => {
        const acc = initial;

        for (let i = 0; i < fnList.length; i++) {
            const result = self.invokeOrReturn(fnList[i], acc, context);
            if (result && typeof result === 'object') {
                Object.assign(acc, result);
            }
        }

        return acc;
    };

};
