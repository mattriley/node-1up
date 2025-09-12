module.exports = ({ self }) => {

    const batchWrite = self.batchWriteConfigure();
    batchWrite.configure = batchWrite;
    return batchWrite;

}
