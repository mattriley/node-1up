module.exports = ({ fsp, config }) => async (path, data, indent = config.indent) => {

    const json = JSON.stringify(data, null, indent);
    return fsp.writeFile(path, json);

};
