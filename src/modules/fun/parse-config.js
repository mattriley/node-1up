module.exports = () => (defaults = {}, config = {}) => {

    if (typeof defaults !== 'object' || defaults === null || Array.isArray(defaults)) {
        throw new Error(`[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`);
    }

    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
        throw new Error(`[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`);
    }

    const defaultKeys = Object.keys(defaults);
    const isPlainObject = val =>
        typeof val === 'object' && val !== null && val.constructor === Object;

    return (args = []) => {
        if (!Array.isArray(args)) {
            throw new Error(`[parseConfig] "options" must be an array. Received: ${typeof args}`);
        }

        args = [...args];
        let overrides = {};

        const maybeLast = args[args.length - 1];

        if (isPlainObject(maybeLast)) {
            const keys = Object.keys(maybeLast);
            const hasValidKeys = keys.every(k => defaultKeys.includes(k));
            const hasAtLeastOne = keys.some(k => defaultKeys.includes(k));

            if (keys.length > 0 && hasValidKeys && hasAtLeastOne) {
                overrides = args.pop(); // it's a valid options bag
            }
        }

        if (args.length > defaultKeys.length) {
            const extras = args.slice(defaultKeys.length);
            throw new Error(`[parseConfig] Too many positional options: ${JSON.stringify(extras)}`);
        }

        const options = args.reduce((acc, val, i) => {
            acc[defaultKeys[i]] = val;
            return acc;
        }, {});

        return {
            ...defaults,
            ...config,
            ...options,
            ...overrides
        };
    };
};
