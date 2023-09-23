module.exports = ({ io, config }) => (path, data, indent = config.indent) => {

    return io.fs.writeFileSync(path, JSON.stringify(data, null, indent));

};
