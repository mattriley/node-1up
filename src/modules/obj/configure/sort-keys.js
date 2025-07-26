module.exports = ({ self }) => (config = {}) => {
    config.depth ??= Infinity;
    config.mutate ??= true;

    return (obj, options = {}) => {
        options.depth ??= config.depth;
        options.mutate ??= config.mutate;

        const sortKeys = (obj, currentDepth = options.depth) => {
            if (currentDepth < 1 || obj === null || typeof obj !== 'object') {
                return obj;
            }

            if (Array.isArray(obj)) {
                if (options.mutate) {
                    for (let i = 0; i < obj.length; i++) {
                        obj[i] = sortKeys(obj[i], currentDepth - 1);
                    }
                    return obj;
                } else {
                    return obj.map(item => sortKeys(item, currentDepth - 1));
                }
            }

            if (self.isPlain(obj)) {
                const sortedEntries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));

                if (options.mutate) {
                    for (const key in obj) delete obj[key];
                    for (const [key, value] of sortedEntries) {
                        obj[key] = sortKeys(value, currentDepth - 1);
                    }
                    return obj;
                } else {
                    const result = {};
                    for (const [key, value] of sortedEntries) {
                        result[key] = sortKeys(value, currentDepth - 1);
                    }
                    return result;
                }
            }

            return obj;
        };

        return sortKeys(obj);
    };

};
