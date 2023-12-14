module.exports = ({ io, config }) => (path, data, indent = config.indent) => {

    const json = JSON.stringify(data, null, indent);
    return io.fs.writeFileSync(path, json);

};
