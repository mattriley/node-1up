module.exports = ({ self, fun, arr }) => config => {

    const defaults = { defaultValue: null, depth: Infinity, delimiters: ['.'], ambig: 'error' };
    const parseOptions = fun.parseConfig(defaults, config);
    const regexMemo = {};

    const getRegex = delimiters => {
        const key = JSON.stringify(delimiters);
        const regex = regexMemo[key] ?? self.buildDelimitersRegex(delimiters);
        regexMemo[key] ??= regex;
        return regex;
    };


    return (obj, path, ...options) => {
        const { defaultValue, depth, delimiters, ambig } = parseOptions(options);
        const delimiterRegex = getRegex(delimiters);
        if (!obj) return defaultValue;

        function findKey(currentValue, keysRemaining, results = [], currentDepth = 0) {
            if (keysRemaining.length === 0 || currentDepth >= depth) {
                results.push(currentValue);
                return results;
            }

            const steps = arr.steps(keysRemaining);

            for (const step of steps) {
                const key = step.join('.');
                if (currentValue?.[key] !== undefined) {
                    const newKeysRemaining = keysRemaining.slice(step.length);
                    findKey(currentValue[key], newKeysRemaining, results, currentDepth + 1);
                }
            }

            return results;
        }

        const keys = path.split(delimiterRegex);
        const results = findKey(obj, keys);

        if (results.length === 0) return defaultValue;
        if (results.length > 1) {
            if (ambig === 'first') return results[0];
            throw new Error(`[dig] Found multiple matches for path "${path}": ${results.length} results`);
        }

        return results[0];
    };
};
