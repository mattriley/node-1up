module.exports = ({ self, is }) => (config = {}) => {
    config = { depth: Infinity, mutate: true, defaultValue: null, ...config };

    return (val, options = {}) => {
        options = { ...config, ...options };
        const { depth, mutate, defaultValue } = options;

        const compact = (val, currentDepth) => {
            if (currentDepth < 0 || !is.jsonCompatible(val)) return undefined;
            if (self.isEmpty(val)) return undefined;

            if (Array.isArray(val)) {
                const result = mutate ? val : [...val];
                for (let i = result.length - 1; i >= 0; i--) {
                    const item = result[i];
                    if (!is.jsonCompatible(item)) {
                        result.splice(i, 1);
                        continue;
                    }
                    const cleaned = compact(item, currentDepth - 1);
                    if (self.isEmpty(cleaned)) {
                        result.splice(i, 1);
                    } else {
                        result[i] = cleaned;
                    }
                }
                return result.length ? result : defaultValue;
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
                    if (self.isEmpty(cleaned)) {
                        delete result[key];
                    } else {
                        result[key] = cleaned;
                    }
                }
                return Object.keys(result).length ? result : defaultValue;
            }

            return val;
        };

        return compact(val, depth);
    };
};
