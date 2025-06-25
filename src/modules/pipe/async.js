module.exports = ({ self, is, fun }) => (...args) => {

    return self.with(args, async ({ steps, state, context }) => {
        state = structuredClone(state);
        for (const step of steps) {
            const result = await fun.invokeOrReturn(step, context);
            if (result !== undefined) state = result;
        }
        return state;
    });

}
