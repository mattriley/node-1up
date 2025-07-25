module.exports = () => (config = {}) => {
    config.char = ' ';
    config.size ??= 4;
    config.depth ??= 1;

    return (line, depth = config.depth, size = config.size) => {
        return ' '.repeat(depth * size) + line;
    };
};
