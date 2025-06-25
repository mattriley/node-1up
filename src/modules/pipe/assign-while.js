module.exports = ({ self, is, fun }) => (...args) => {

    return self.with(args, ({ steps, state, context, predicate }) => {
        state = structuredClone(state);
        for (const step of steps) {
            if (predicate && !predicate(state)) return state;
            const result = fun.invokeOrReturn(step, context);
            if (is.plainObject(result)) Object.assign(state, result);
        }
        return state;
    });
};
