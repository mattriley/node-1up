module.exports = ({ self, arr }) => (config = {}) => {
    config.defaultValue ??= undefined;
    config.depth ??= Infinity;
    config.delimiters ??= ['.'];
    const delimiterRegex = self.buildDelimitersRegex(config.delimiters);

    return (obj, path, defaultValue = config.defaultValue, options = {}) => {
        options.depth ??= config.depth;

        if (!obj) return obj;

        function findKey(currentValue, keysRemaining, results = [], depth = 0) {
            if (keysRemaining.length === 0 || depth >= options.depth) {
                results.push(currentValue);
                return results;
            }

            const steps = arr.steps(keysRemaining);

            for (const step of steps) {
                const key = step.join('.');
                if (currentValue?.[key] !== undefined) {
                    const newKeysRemaining = keysRemaining.slice(step.length);
                    findKey(currentValue[key], newKeysRemaining, results, depth + 1);
                }
            }

            return results;
        }

        const keys = path.split(delimiterRegex);
        const results = findKey(obj, keys);

        if (results.length === 0) return defaultValue;
        return results.length === 1 ? results[0] : results;
    };
};
