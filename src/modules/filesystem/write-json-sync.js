module.exports = ({ fs, config }) => (path, data, indent = config.indent) => {

    return fs.writeFileSync(path, JSON.stringify(data, null, indent));

};
