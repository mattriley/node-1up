module.exports = ({ self, fun }) => (...args) => {

    return self.with(args, ({ steps, state, context }) => {
        for (const step of steps) {
            state = fun.invokeOrReturn(step, context ?? state);
        }
        return state;
    });

}
