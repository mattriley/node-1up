module.exports = ({ self, fun }) => (...args) => {

    return self.with(args, async ({ steps, state, context }) => {
        for (const step of steps) {
            const result = await fun.invokeOrReturn(step, context ?? state);
            if (result) state = result;
        }
        return state;
    });

}
