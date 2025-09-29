module.exports = ({ fun }) => config => {
    const defaults = { mutate: false }
    const parseOptions = fun.parseConfig(defaults, config);

    return (arr, item, options) => {
        options = parseOptions(options);

        const idx = arr.length < 2 ? arr.length : arr.length - 1; // push if <2, else before last

        if (options.mutate) {
            arr.splice(idx, 0, item);
            return arr;
        }

        // non-mutating
        if (idx === arr.length) return [...arr, item];
        return [...arr.slice(0, idx), item, ...arr.slice(idx)];
    };
};
