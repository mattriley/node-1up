module.exports = ({ self, config }) => async (path, data, indent = config.indent) => {

    const json = JSON.stringify(data, null, indent);
    return await self.nodefs.promises.writeFile(path, json);

};
