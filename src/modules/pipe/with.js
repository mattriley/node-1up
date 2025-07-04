module.exports = ({ is, fun }) => {

    const cleanArgs = (...args) => {
        let steps, defaultContext, stateKey = 'state', predicate;

        for (const arg of args) {
            if (is.plainFunction(arg)) {
                predicate = arg;
            } else if (Array.isArray(arg)) {
                steps = arg;
            } else if (typeof arg === 'string') {
                stateKey = arg;
            } else if (typeof arg === 'object' && arg !== null) {
                const values = Object.values(arg);
                const allFuncs = values.length > 0 && values.every(v => typeof v === 'function');
                if (!steps && allFuncs) {
                    steps = values;
                } else {
                    defaultContext = arg;
                }
            }
        }

        if (!Array.isArray(steps)) {
            throw new TypeError('Expected an array or object of functions');
        }

        for (const step of steps) {
            if (typeof step !== 'function') {
                throw new TypeError('All elements must be functions');
            }
        }

        return { steps, defaultContext, stateKey, predicate };
    };

    return (config, nextState) => {
        const { steps, defaultContext, stateKey, predicate } = cleanArgs(...config.args);

        return (initial, context) => {
            context = defaultContext || context ? { ...defaultContext, ...context } : null;
            let state = initial;
            if (context) context[stateKey] = state;

            if (config.async) {
                return (async () => {
                    for (const step of steps) {
                        if (predicate && !predicate(state)) break;
                        const result = await fun.invokeOrReturn(step, context ?? state);
                        if (result !== undefined) {
                            state = nextState({ stepResult: result, state });
                        }
                    }
                    return state;
                })();
            } else {
                for (const step of steps) {
                    if (predicate && !predicate(state)) break;
                    const result = fun.invokeOrReturn(step, context ?? state);
                    if (result !== undefined) {
                        state = nextState({ stepResult: result, state });
                    }
                }
                return state;
            }
        };
    };


};
