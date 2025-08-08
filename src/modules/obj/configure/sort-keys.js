module.exports = ({ self }) => (config = {}) => {
    config = { depth: Infinity, mutate: true, ...config };

    return (obj, options = {}) => {
        options = { ...config, ...options };
        const { depth, mutate } = options;

        const sortKeys = (obj, currentDepth = depth) => {
            if (currentDepth < 1 || obj === null || typeof obj !== 'object') {
                return obj;
            }

            if (Array.isArray(obj)) {
                if (mutate) {
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

                if (mutate) {
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
