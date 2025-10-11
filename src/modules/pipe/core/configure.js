// executor.js
module.exports = ({ self, fun }) => (config, applyStep) => {
    const { steps, defaultContext, stateKey, predicate } =
        self.core.resolveArgs(...config.args);

    const runner = config.async ? self.core.runAsync : self.core.runSync;
    const defer = !!config.defer;

    // Immediate-mode value selection:
    // - If there is only one arg and it's an array => that's steps only (no initial)
    // - Otherwise => use the LAST arg as the value (works for pipe, assign, assignWhile, etc.)
    const valueFromArgs = (() => {
        const args = config.args || [];
        if (args.length === 1 && Array.isArray(args[0])) return undefined;
        return args.length ? args[args.length - 1] : undefined;
    })();

    const exec = (value = {}) => {
        const hasStateKey = typeof stateKey === 'string' && stateKey.length > 0;

        if (hasStateKey) {
            // Treat the incoming value as CONTEXT no matter what
            const valueObj =
                value !== null && typeof value === 'object' ? value : {};

            // Merge defaultContext under provided context (provided wins)
            const context = defaultContext
                ? { ...defaultContext, ...valueObj }
                : { ...valueObj };

            // Always ensure context[stateKey] exists; default to {}
            if (!(stateKey in context) || context[stateKey] == null) {
                context[stateKey] = {};
            }

            const initial = context[stateKey];

            return runner({
                state: initial,
                context,
                steps,
                predicate,
                stateKey,
                applyStep,
                fun
            });
        }

        // No stateKey => treat value as INITIAL; do not mutate context with an undefined key
        const context = defaultContext ? { ...defaultContext } : null;
        const initial = value;

        return runner({
            state: initial,
            context,
            steps,
            predicate,
            stateKey, // undefined (by design) when not provided
            applyStep,
            fun
        });
    };

    // Deferred: return callable; Immediate: execute now with computed value
    return defer ? exec : exec(valueFromArgs);
};
