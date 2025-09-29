module.exports = $ => (defaults = {}, config = {}) => {
    if (!$.is.plainObject(defaults)) {
        throw new Error(
            `[parseConfig] "defaults" must be a plain object. Received: ${JSON.stringify(defaults)}`
        );
    }

    if (!$.is.plainObject(config)) {
        throw new Error(
            `[parseConfig] "config" must be a plain object. Received: ${JSON.stringify(config)}`
        );
    }

    const defaultKeys = Object.keys(defaults);
    const defaultKeySet = new Set(defaultKeys);

    // Utility to drop undefined entries
    const clean = obj => {
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
            if (v !== undefined) out[k] = v;
        }
        return out;
    };

    return (options = {}) => {
        if (!$.is.plainObject(options)) {
            throw new Error(
                `[parseConfig] "options" must be a plain object. Received: ${typeof options}`
            );
        }

        // Validate keys are known
        for (const key of Object.keys(options)) {
            if (!defaultKeySet.has(key)) {
                throw new Error(`[parseConfig] Unknown option key: "${key}"`);
            }
        }

        return {
            ...defaults,
            ...clean(config),
            ...clean(options),
        };
    };
};
