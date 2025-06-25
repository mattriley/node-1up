module.exports = ({ self, fun }) => (...args) => {

    return self.with(args, ({ steps, state, context }) => {
        for (const step of steps) {
            const result = fun.invokeOrReturn(step, context);
            if (result) Object.assign(state, result);
        }
        return state;
    });

}
