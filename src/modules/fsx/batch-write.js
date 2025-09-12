module.exports = ({ self }) => {

    const configure = self.batchWriteConfigure;
    const batchWrite = configure();
    return Object.assign(batchWrite, { configure });

}
