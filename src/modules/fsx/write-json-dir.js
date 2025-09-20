module.exports = ({ self }) => {

    const configure = self.writeJsonDirConfigure;
    const writeJsonDir = configure();
    return Object.assign(writeJsonDir, { configure });

};
