module.exports = $ => config => {
    const defaults = { delimiter: null, depth: Infinity, mutate: true };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (obj, options) => {
        options = parseOptions(options);
        const result = {};

        const recurse = (value, parentKey = '', currentDepth = 0) => {
            for (const [key, val] of Object.entries(value)) {
                const isLeaf = !$.is.plainObject(val) || currentDepth >= options.depth;

                const newKey = options.delimiter && parentKey ? `${parentKey}${options.delimiter}${key}` : options.delimiter ? key : key; // no prefixing at all

                if (isLeaf) {
                    if (newKey in result) throw new Error(`Collision: ${newKey}`);
                    result[newKey] = val;
                } else {
                    recurse(val, options.delimiter ? newKey : '', currentDepth + 1);
                }
            }
        };

        recurse(obj);

        return options.mutate ? Object.assign(obj, result) : result;
    };
};
