module.exports = $ => config => {
    const defaults = { size: 4, depth: 1, char: ' ' };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (line, options) => {
        const { char, size, depth } = parseOptions(options);
        return char.repeat(depth * size) + line;
    };
};
