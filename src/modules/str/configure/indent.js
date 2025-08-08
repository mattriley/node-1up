module.exports = ({ fun }) => config => {
    const defaults = { size: 4, depth: 1, char: ' ' };
    const parseArgs = fun.parseConfig(defaults, config);

    return (line, ...args) => {
        const { char, size, depth } = parseArgs(...args);
        return char.repeat(depth * size) + line;
    };
};
