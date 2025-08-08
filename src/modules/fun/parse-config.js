module.exports = ({ is }) => (defaults = {}, config = {}) => {
    if (!is.plainObject(defaults)) {
        throw new Error(`[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`);
    }

    if (!is.plainObject(config)) {
        throw new Error(`[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`);
    }

    const defaultKeys = Object.keys(defaults);
    const defaultKeySet = new Set(defaultKeys);

    return (args = []) => {
        if (!Array.isArray(args)) {
            throw new Error(`[parseConfig] "options" must be an array. Received: ${typeof args}`);
        }

        let overrides = {};
        let input = args;

        const last = args[args.length - 1];

        if (is.plainObject(last)) {
            const keys = Object.keys(last);

            if (keys.length > 0) {
                let matchCount = 0;

                for (const key of keys) {
                    if (!defaultKeySet.has(key)) {
                        matchCount = -1;
                        break;
                    }
                    matchCount++;
                }

                if (matchCount > 0) {
                    overrides = last;
                    input = args.slice(0, -1);
                }
            }
        }

        if (input.length > defaultKeys.length) {
            throw new Error(`[parseConfig] Too many positional options: ${JSON.stringify(input.slice(defaultKeys.length))}`);
        }

        const positional = {};
        for (let i = 0; i < input.length; i++) {
            positional[defaultKeys[i]] = input[i];
        }

        return {
            ...defaults,
            ...config,
            ...positional,
            ...overrides
        };
    };
};
