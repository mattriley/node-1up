module.exports = ({ self, fun }) => (config, applyStep) => {
    const { steps, defaultContext, stateKey, predicate } =
        self.core.resolveArgs(...config.args);

    const runner = config.async ? self.core.runAsync : self.core.runSync;
    const defer = !!config.defer; // just coerce to boolean

    const exec = (initial = {}, ctx) => {
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
            applyStep,
            fun
        });
    };

    // non-deferred branch still returns a function, defaulting state sensibly
    return defer ? exec : (...args) => exec(...args);
};
