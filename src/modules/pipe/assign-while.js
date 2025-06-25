module.exports = ({ self, fun }) => (...args) => {

    return self.with(args, ({ steps, state, context, predicate }) => {
        for (const step of steps) {
            if (predicate && !predicate(state)) return state;
            const result = fun.invokeOrReturn(step, context);
            if (result) Object.assign(state, result);
        }
        return state;
    });
};
