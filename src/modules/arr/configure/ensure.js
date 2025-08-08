module.exports = ({ fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.array, config);

    return (val, ...options) => {
        const { delimiter } = parseOptions(options);
        if (val == null) return []; // handles null and undefined
        if (Array.isArray(val)) return val;

        return val
            .toString()
            .split(delimiter)
            .map(s => s.trim())
            .filter(Boolean);
    };
};
