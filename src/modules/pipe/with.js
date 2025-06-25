module.exports = ({ self }) => (args, impl) => {

    const { steps, defaultContext, stateKey, predicate } = self.cleanArgs(...args);

    return (initial = {}, context = {}) => {
        context = { ...defaultContext, ...context };
        const state = initial;
        Object.assign(context, { [stateKey]: state });
        return impl({ steps, state, context, predicate });
    };
};
