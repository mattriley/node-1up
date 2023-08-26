module.exports = ({ config }) => (line, depth, indent = config.indent) => {

    return ' '.repeat(depth * indent) + line;

};
