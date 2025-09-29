module.exports = $ => config => {

    const parseOptions = $.fun.parseConfig($.defaults.path, config);

    return (pathname, item, ...options) => {
        const { delimiter } = parseOptions(options);
        return $.arr.insertBeforeLast(pathname.split(delimiter), item).join(delimiter);
    };
};
