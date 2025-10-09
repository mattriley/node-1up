module.exports = ({ self, fun }) => (config, applyStep) => {
    const { steps, defaultContext, stateKey, predicate } =
        self.core.resolveArgs(...config.args);

    const runner = config.async ? self.core.runAsync : self.core.runSync;
    const defer = !!config.defer; // just coerce to boolean

    // Single-arg exec:
    // - If arg is an object and has stateKey -> treat as context
    // - Otherwise -> treat as initial
    const exec = (value = {}) => {
        const isObj = value !== null && typeof value === 'object';
        const isContext = isObj && (stateKey in value);

        // Build context
        const context = isContext
            // Merge provided context over defaultContext (provided wins)
            ? (defaultContext ? { ...defaultContext, ...value } : value)
            // If value is initial, only use defaultContext (or null if absent)
            : (defaultContext ? { ...defaultContext } : null);

        // Determine initial state
        const initial = isContext ? value[stateKey] : value;

        // Ensure context[stateKey] mirrors the current state when context exists
        if (context) {
            context[stateKey] = initial;
        }

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
