module.exports = ({ arr, fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.path, config);

    return (pathname, item, ...options) => {
        const { delimiter } = parseOptions(options);
        return arr.insertBeforeLast(pathname.split(delimiter), item).join(delimiter);
    }
};
