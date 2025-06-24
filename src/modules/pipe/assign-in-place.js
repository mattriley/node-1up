module.exports = ({ self, is, fun }) => (...args) => {

    const { steps, defaultContext, stateKey } = self.cleanArgs(...args);

    return (initial = {}, context) => {
        context ??= defaultContext;
        const state = initial;
        const param = { [stateKey]: state, context };
        for (const step of steps) {
            const result = fun.invokeOrReturn(step, param);
            if (is.plainObject(result)) Object.assign(initial, result);
        }
        return state;
    };
};
