module.exports = ({ is }) => (config = {}) => (obj) => {

    const delimiter = config.delimiter ?? null;
    const maxDepth = config.depth ?? Infinity;
    const mutate = config.mutate ?? true;

    const result = {};

    const recurse = (value, parentKey = '', currentDepth = 0) => {
        for (const [key, val] of Object.entries(value)) {
            const isLeaf = !is.plainObject(val) || currentDepth >= maxDepth;

            const newKey = delimiter && parentKey
                ? `${parentKey}${delimiter}${key}`
                : delimiter
                    ? key
                    : key; // no prefixing at all

            if (isLeaf) {
                if (newKey in result) throw new Error(`Collision: ${newKey}`);
                result[newKey] = val;
            } else {
                recurse(val, delimiter ? newKey : '', currentDepth + 1);
            }
        }
    };

    recurse(obj);

    return mutate ? Object.assign(obj, result) : result;
};
