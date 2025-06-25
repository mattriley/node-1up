const merge = require('lodash.merge');

module.exports = ({ self, is, fun }) => (...args) => {

    return self.with(args, (steps, state, context) => {
        state = structuredClone(state);
        for (const step of steps) {
            const result = fun.invokeOrReturn(step, context);
            if (is.plainObject(result)) merge(state, result);
        }
        return state;
    });

}
