module.exports = () => (defaults = {}, config = {}) => {

    if (typeof defaults !== 'object' || defaults === null || Array.isArray(defaults)) {
        throw new Error(`[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`);
    }

    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
        throw new Error(`[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`);
    }

    const keys = Object.keys(defaults);

    return (args = []) => {
        args = [...args];

        if (Array.isArray(args)) {

            const hasOverrides =
                args.length > 0 &&
                typeof args[args.length - 1] === 'object' &&
                !Array.isArray(args[args.length - 1]);

            const overrides = hasOverrides ? args.pop() : {};

            const options = args.reduce((acc, val, i) => {
                acc[keys[i]] = val;
                return acc;
            }, {});


            if (args.length > keys.length) {
                const extras = args.slice(keys.length);
                throw new Error(`[parseConfig] Too many positional options: ${JSON.stringify(extras)}`);
            }


            return {
                ...defaults,
                ...config,
                ...options,
                ...overrides
            };
        }

        if (typeof options === 'object' && options !== null) {
            return {
                ...defaults,
                ...config,
                ...options
            };
        }

        throw new Error(`[parseConfig] "options" must be an array or object. Received: ${typeof options}`);
    };
};
