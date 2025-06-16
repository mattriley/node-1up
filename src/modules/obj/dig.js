const DELIMITER = '.';

module.exports = ({ arr }) => (obj, path, defaultValue = undefined) => {

    function findKey(currentValue, keysRemaining, results = []) {
        if (keysRemaining.length === 0) {
            results.push(currentValue);
            return results;
        }

        const steps = arr.steps(keysRemaining);

        for (const step of steps) {
            const key = step.join(DELIMITER);
            if (currentValue[key]) {
                const newKeysRemaining = keysRemaining.slice(step.length);
                findKey(currentValue[key], newKeysRemaining, results);
            }
        }

        return results;
    }

    const keys = path.split(DELIMITER);
    const results = findKey(obj, keys);
    if (results.length === 0) return defaultValue;
    return results.length === 1 ? results[0] : results;
}
