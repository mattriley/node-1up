module.exports = ({ is }) => (defaults = {}, config = {}) => {

    if (!is.plainObject(defaults)) {
        throw new Error(`[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`);
    }

    if (!is.plainObject(config)) {
        throw new Error(`[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`);
    }

    const defaultKeys = Object.keys(defaults);

    return (args = []) => {
        if (!Array.isArray(args)) {
            throw new Error(`[parseConfig] "options" must be an array. Received: ${typeof args}`);
        }

        const input = [...args];
        let overrides = {};

        const last = input[input.length - 1];
        if (is.plainObject(last)) {
            const keys = Object.keys(last);
            const matchesDefaults = keys.every(k => defaultKeys.includes(k));
            const hasRelevantKey = keys.some(k => defaultKeys.includes(k));

            if (keys.length && matchesDefaults && hasRelevantKey) {
                overrides = input.pop(); // treat as options
            }
        }

        if (input.length > defaultKeys.length) {
            const extras = input.slice(defaultKeys.length);
            throw new Error(`[parseConfig] Too many positional options: ${JSON.stringify(extras)}`);
        }

        const positional = input.reduce((acc, val, i) => {
            acc[defaultKeys[i]] = val;
            return acc;
        }, {});

        return {
            ...defaults,
            ...config,
            ...positional,
            ...overrides
        };
    };

};
