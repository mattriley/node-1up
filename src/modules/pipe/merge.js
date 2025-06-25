const merge = require('lodash.merge');

module.exports = ({ self, fun }) => (...args) => {

    return self.with(args, ({ steps, state, context }) => {
        for (const step of steps) {
            const result = fun.invokeOrReturn(step, context);
            if (result) merge(state, result);
        }
        return state;
    });

}
