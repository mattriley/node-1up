module.exports = ({ self }) => {

    const configure = self.insertSequenceNumbersConfigure;
    const insertSequenceNumbers = configure();
    return Object.assign(insertSequenceNumbers, { configure });

};
