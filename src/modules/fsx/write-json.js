module.exports = ({ self }) => {

    const writeJson = self.writeJsonConfigure();
    writeJson.configure = self.writeJsonConfigure;
    return writeJson;

}
