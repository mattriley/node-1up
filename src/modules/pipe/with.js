module.exports = ({ self, fun }) => {
    return (config, nextState) => {
        const { steps, defaultContext, stateKey, predicate } =
            self.core.resolveArgs(...config.args);

        const runner = config.async
            ? self.core.runAsync({ steps, predicate, stateKey, fun, nextState })
            : self.core.runSync({ steps, predicate, stateKey, fun, nextState });

        return (initial, ctx) => {
            const context = (defaultContext || ctx)
                ? { ...(defaultContext || {}), ...(ctx || {}) }
                : null;

            if (context) context[stateKey] = initial;

            return runner(initial, context);
        };
    };
};
