module.exports = () => (defaults = {}, config = {}) => {
    const keys = Object.keys(defaults);

    return (...args) => {
        const inputArgs = [...args];

        const hasOptions =
            inputArgs.length > 0 &&
            typeof inputArgs[inputArgs.length - 1] === 'object' &&
            !Array.isArray(inputArgs[inputArgs.length - 1]);

        const optionsArg = hasOptions ? inputArgs.pop() : {};
        const mapped = {};

        if (inputArgs.length > keys.length) {
            const extras = inputArgs.slice(keys.length);
            throw new Error(`[parseConfig] Too many positional arguments: ${JSON.stringify(extras)}`);
        }

        for (let i = 0; i < inputArgs.length; i++) {
            mapped[keys[i]] = inputArgs[i];
        }

        return {
            ...defaults,
            ...config,
            ...mapped,
            ...optionsArg
        };
    };
};
