module.exports = ({ self }) => {

    const batchReadJson = self.batchReadJsonConfigure();
    batchReadJson.configure = self.batchReadJsonConfigure;
    return batchReadJson;

}
