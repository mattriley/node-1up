// executor.js
module.exports = ({ self, fun }) => (config, applyStep) => {
    const { steps, defaultContext, stateKey, predicate } =
        self.core.resolveArgs(...config.args);

    const runner = config.async ? self.core.runAsync : self.core.runSync;
    const defer = !!config.defer;

    // Pull the single "value" from args in non-deferred mode.
    // Convention: config.args = [steps, value?] for non-deferred calls
    const valueFromArgs = config.args.length ? config.args[config.args.length - 1] : undefined;

    const exec = (value = {}) => {
        const isObj = value !== null && typeof value === 'object';
        const isContext = isObj && (stateKey in value);

        const context = isContext
            ? (defaultContext ? { ...defaultContext, ...value } : value)
            : (defaultContext ? { ...defaultContext } : null);

        const initial = isContext ? value[stateKey] : value;

        if (context) {
            context[stateKey] = initial;
        }

        return runner({
            state: initial,
            context,
            steps,
            predicate,
            stateKey,
            applyStep,
            fun
        });
    };

    // If deferred, return a function that accepts the single value later.
    // If not deferred, execute immediately using the value provided alongside steps.
    return defer ? exec : exec(valueFromArgs);
};
