module.exports = ({ is }) => (config = {}) => {
    config = { delimiter: null, depth: Infinity, mutate: true, ...config };

    return (obj, options = {}) => {
        options = { ...config, ...options };
        const { delimiter, depth, mutate } = options;
        const result = {};

        const recurse = (value, parentKey = '', currentDepth = 0) => {
            for (const [key, val] of Object.entries(value)) {
                const isLeaf = !is.plainObject(val) || currentDepth >= depth;

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
};
