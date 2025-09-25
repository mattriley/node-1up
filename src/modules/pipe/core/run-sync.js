module.exports = ({ fun }) => ({ steps, predicate, stateKey, nextState }) => {

    return (state, context) => {
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

};
