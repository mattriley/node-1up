module.exports = ({ self, fun }) => {

    return (config, nextState) => {
        const { steps, defaultContext, stateKey, predicate } = self.core.resolveArgs(...config.args);

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
