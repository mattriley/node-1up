module.exports = ({ self, fun }) => (...args) => {

    return self.with(args, async ({ steps, state, context }) => {
        for (const step of steps) {
            state = await fun.invokeOrReturn(step, context);
        }
        return state;
    });

}
