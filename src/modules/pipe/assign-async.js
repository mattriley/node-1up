module.exports = ({ self, is, fun }) => (...args) => {

    return self.with(args, async ({ steps, state, context }) => {
        state = structuredClone(state);
        for (const step of steps) {
            const result = await fun.invokeOrReturn(step, context);
            if (is.plainObject(result)) Object.assign(state, result);
        }
        return state;
    });

}
