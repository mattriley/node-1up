module.exports = () => (defaults = {}, config = {}) => {
    const keys = Object.keys(defaults);

    return (options = []) => {
        if (Array.isArray(options)) {
            const input = [...options];

            const hasOverrides =
                input.length > 0 &&
                typeof input[input.length - 1] === 'object' &&
                !Array.isArray(input[input.length - 1]);

            const overrides = hasOverrides ? input.pop() : {};
            const mapped = {};

            if (input.length > keys.length) {
                const extras = input.slice(keys.length);
                throw new Error(`[parseConfig] Too many positional options: ${JSON.stringify(extras)}`);
            }

            for (let i = 0; i < input.length; i++) {
                mapped[keys[i]] = input[i];
            }

            return {
                ...defaults,
                ...config,
                ...mapped,
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

        throw new Error(`[parseConfig] Expected options to be array or object, got: ${typeof options}`);
    };
};
