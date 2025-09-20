module.exports = ({ self }) => {

    const configure = self.batchReadJsonConfigure;
    const batchReadJson = configure();
    return Object.assign(batchReadJson, { configure });

};
