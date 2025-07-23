module.exports = ({ is }) => (config = {}) => {

    const depth = config.depth ?? Infinity;
    const mutate = config.mutate ?? true;

    const isRemovable = val =>
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'object' && val !== null && Object.keys(val).length === 0);

    const compact = (val, currentDepth = depth) => {
        if (currentDepth < 0 || !is.jsonCompatible(val)) return undefined;
        if (isRemovable(val)) return undefined;

        if (Array.isArray(val)) {
            const result = mutate ? val : [...val];
            for (let i = result.length - 1; i >= 0; i--) {
                const item = result[i];
                if (!is.jsonCompatible(item)) {
                    result.splice(i, 1);
                    continue;
                }
                const cleaned = compact(item, currentDepth - 1);
                if (isRemovable(cleaned)) {
                    result.splice(i, 1);
                } else {
                    result[i] = cleaned;
                }
            }
            return result.length ? result : undefined;
        }

        if (typeof val === 'object' && val !== null) {
            const result = mutate ? val : { ...val };
            for (const key of Object.keys(result)) {
                const item = result[key];
                if (!is.jsonCompatible(item)) {
                    delete result[key];
                    continue;
                }
                const cleaned = compact(item, currentDepth - 1);
                if (isRemovable(cleaned)) {
                    delete result[key];
                } else {
                    result[key] = cleaned;
                }
            }
            return Object.keys(result).length ? result : undefined;
        }

        return val;
    };

    return compact;
};
