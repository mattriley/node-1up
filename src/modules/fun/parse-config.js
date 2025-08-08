module.exports = () => (defaults = {}, config = {}) => {

    if (typeof defaults !== 'object' || defaults === null || Array.isArray(defaults)) {
        throw new Error(`[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`);
    }

    if (typeof config !== 'object' || config === null || Array.isArray(config)) {
        throw new Error(`[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`);
    }

    const keys = Object.keys(defaults);

    const omitUndefined = obj =>
        Object.fromEntries(Object.entries(obj).filter(([_, val]) => val !== undefined));

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
                const val = input[i];
                if (val !== undefined) mapped[keys[i]] = val;
            }

            return {
                ...defaults,
                ...omitUndefined(config),
                ...mapped,
                ...omitUndefined(overrides)
            };
        }

        if (typeof options === 'object' && options !== null) {
            return {
                ...defaults,
                ...omitUndefined(config),
                ...omitUndefined(options)
            };
        }

        throw new Error(`[parseConfig] "options" must be an array or object. Received: ${typeof options}`);
    };
};
