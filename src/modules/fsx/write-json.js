module.exports = ({ self }) => {

    const configure = self.writeJsonConfigure;
    const writeJson = configure();
    return Object.assign(writeJson, { configure });

};
