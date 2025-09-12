module.exports = ({ self }) => {

    const writeJsonDir = self.writeJsonDirConfigure();
    writeJsonDir.configure = self.writeJsonDirConfigure;
    return writeJsonDir;

}
