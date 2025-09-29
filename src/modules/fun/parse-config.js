module.exports = ({ is }) => (defaults = {}, config = {}) => {
    if (!is.plainObject(defaults)) {
        throw new Error(`[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`);
    }

    if (!is.plainObject(config)) {
        throw new Error(`[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`);
    }

    const defaultKeys = Object.keys(defaults);
    const defaultKeySet = new Set(defaultKeys);

    return (options = []) => {
        // New path: plain-object options
        if (is.plainObject(options)) {
            // Validate keys are known
            for (const key of Object.keys(options)) {
                if (!defaultKeySet.has(key)) {
                    throw new Error(`[parseConfig] Unknown option key: "${key}"`);
                }
            }
            return {
                ...defaults,
                ...config,
                ...options
            };
        }

        // Legacy path: array with positional + optional overrides object
        if (!Array.isArray(options)) {
            throw new Error(`[parseConfig] "options" must be an array or a plain object. Received: ${typeof options}`);
        }

        let overrides = {};
        let input = options;

        const last = options[options.length - 1];

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
                    input = options.slice(0, -1);
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
