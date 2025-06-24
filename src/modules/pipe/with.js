module.exports = ({ self }) => (args, impl) => {

    const { steps, defaultContext, stateKey } = self.cleanArgs(...args);

    return (initial = {}, context) => {
        context ??= defaultContext;
        const state = initial;
        Object.assign(context, { [stateKey]: state });
        return impl(steps, state, context);
    };
};
