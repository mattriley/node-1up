module.exports = ({ fun }) => ({ steps, predicate, stateKey, nextState }) => {

    return async (state, context) => {
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

};
