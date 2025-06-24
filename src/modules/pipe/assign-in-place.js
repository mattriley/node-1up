module.exports = ({ self, is, fun }) => (...args) => {

    const { steps, defaultContext, stateKey } = self.cleanArgs(...args);

    return (initial = {}, context) => {
        context ??= defaultContext;
        const state = initial;
        Object.assign(context, { [stateKey]: state });
        for (const step of steps) {
            const result = fun.invokeOrReturn(step, context);
            if (is.plainObject(result)) Object.assign(state, result);
        }
        return state;
    };
};
