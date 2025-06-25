module.exports = ({ self, is, fun }) => (...args) => {

    return self.with(args, ({ steps, state, context }) => {
        for (const step of steps) {
            const result = fun.invokeOrReturn(step, context);
            if (is.plainObject(result)) Object.assign(state, result);
        }
        return state;
    });

}
