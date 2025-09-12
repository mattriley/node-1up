module.exports = ({ fun }) => config => {

    const defaults = { mutate: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (arr, item, ...options) => {
        const { mutate } = parseOptions(options);

        if (mutate) {
            if (arr.length < 2) arr.push(item);
            else arr.splice(arr.length - 1, 0, item);
            return arr;
        } else {
            if (arr.length < 2) return [...arr, item];
            return [...arr.slice(0, -1), item, arr[arr.length - 1]];
        }

    };
};
