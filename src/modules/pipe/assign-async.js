module.exports = ({ self, is, fun }) => (...args) => {

    return self.with(args, async ({ steps, state, context }) => {
        for (const step of steps) {
            const result = await fun.invokeOrReturn(step, context);
            if (result) Object.assign(state, result);
        }
        return state;
    });

}
