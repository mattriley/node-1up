module.exports = ({ fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.array, config);

    return (arr, ...options) => {
        const { delimiter, finalDelimiter = delimiter } = parseOptions(options);
        if (arr.length <= 1) return arr[0] || '';
        return arr.slice(0, -1).join(delimiter) + finalDelimiter + arr[arr.length - 1];
    };
};
