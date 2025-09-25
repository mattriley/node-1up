module.exports = ({ fun }) => ({ state, context, steps, predicate, stateKey, applyStep }) => {
    let s = state;

    for (const step of steps) {
        if (predicate && !predicate(s)) break;

        const result = fun.invokeOrReturn(step, context ?? s);
        if (result !== undefined) {
            s = applyStep({ stepResult: result, state: s });
            if (context) context[stateKey] = s; // keep in sync
        }
    }

    return s;
};
