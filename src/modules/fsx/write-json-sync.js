module.exports = ({ self, config }) => (path, data, indent = config.indent) => {

    const json = JSON.stringify(data, null, indent);
    return self.nodefs.writeFileSync(path, json);

};
