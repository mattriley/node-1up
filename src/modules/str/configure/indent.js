const defaults = { char: ' ', size: 4, depth: 1 };

module.exports = ({ fun }) => (config = {}) => {
    const parseArgs = fun.parseConfig(defaults, config);

    return (line, ...args) => {
        const { char, size, depth } = parseArgs(...args);
        return char.repeat(depth * size) + line;
    };
};
