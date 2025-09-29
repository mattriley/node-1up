module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.path, config);

    return (pathname, item, options) => {
        options = parseOptions(options);
        return $.arr.insertBeforeLast(pathname.split(options.delimiter), item).join(options.delimiter);
    };
};
