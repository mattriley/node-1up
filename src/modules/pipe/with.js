module.exports = ({ is, fun }) => {

    const isPlainObj = v => v != null && typeof v === 'object' && !Array.isArray(v);

    const cleanArgs = (...args) => {
        let steps;
        let defaultContext;
        let stateKey = 'state';
        let predicate;

        for (const arg of args) {
            if (is.plainFunction && is.plainFunction(arg)) {
                // last plain function wins as predicate (back-compat)
                predicate = arg;
                continue;
            }
            if (Array.isArray(arg)) {
                steps = arg; // first array wins
                continue;
            }
            if (typeof arg === 'string') {
                stateKey = arg;
                continue;
            }
            if (isPlainObj(arg)) {
                // If all values are functions and steps not set, treat as object-of-functions
                const values = Object.values(arg);
                const allFuncs = values.length > 0 && values.every(v => typeof v === 'function');
                if (!steps && allFuncs) {
                    steps = values;
                } else {
                    defaultContext = arg; // treat as options/context
                }
            }
        }

        if (!Array.isArray(steps)) {
            throw new TypeError('Expected an array or object of functions');
        }

        // Allow each step to be a function OR a plain object
        for (const step of steps) {
            const isFn = typeof step === 'function';
            if (!isFn && !isPlainObj(step)) {
                throw new TypeError('All elements must be functions or plain objects');
            }
        }

        return { steps, defaultContext, stateKey, predicate };
    };

    return (config, nextState) => {
        const { steps, defaultContext, stateKey, predicate } = cleanArgs(...config.args);

        const runSync = (state, context) => {
            for (const step of steps) {
                if (predicate && !predicate(state)) break;
                const result = fun.invokeOrReturn(step, context ?? state);
                if (result !== undefined) {
                    state = nextState({ stepResult: result, state });
                    if (context) context[stateKey] = state; // keep in sync
                }
            }
            return state;
        };

        const runAsync = async (state, context) => {
            for (const step of steps) {
                if (predicate && !predicate(state)) break;
                const result = await fun.invokeOrReturn(step, context ?? state);
                if (result !== undefined) {
                    state = nextState({ stepResult: result, state });
                    if (context) context[stateKey] = state; // keep in sync
                }
            }
            return state;
        };

        const runner = config.async ? runAsync : runSync;

        return (initial, ctx) => {
            const context = (defaultContext || ctx)
                ? { ...(defaultContext || {}), ...(ctx || {}) }
                : null;

            if (context) context[stateKey] = initial;

            return runner(initial, context);
        };
    };

};
