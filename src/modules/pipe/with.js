module.exports = ({ self }) => (config, applyStep) => {

    const { steps, defaultContext, stateKey, predicate } =
        self.core.resolveArgs(...config.args);

    const runner = config.async ? self.core.runAsync : self.core.runSync;

    return (initial, ctx) => {
        const context = (defaultContext || ctx)
            ? { ...(defaultContext || {}), ...(ctx || {}) }
            : null;

        if (context) context[stateKey] = initial;

        return runner({
            state: initial,
            context,
            steps,
            predicate,
            stateKey,
            applyStep
        });
    };

};
