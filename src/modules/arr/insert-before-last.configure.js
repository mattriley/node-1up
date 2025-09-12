module.exports = ({ fun }) => config => {
    const parseOptions = fun.parseConfig({ mutate: false }, config);

    return (arr, item, ...options) => {
        const { mutate } = parseOptions(options);
        const idx = arr.length < 2 ? arr.length : arr.length - 1; // push if <2, else before last

        if (mutate) {
            arr.splice(idx, 0, item);
            return arr;
        }

        // non-mutating
        if (idx === arr.length) return [...arr, item];
        return [...arr.slice(0, idx), item, ...arr.slice(idx)];
    };
};
