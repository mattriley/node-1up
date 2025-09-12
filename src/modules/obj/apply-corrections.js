module.exports = ({ self }) => {

    const configure = self.applyCorrectionsConfigure;
    const applyCorrections = configure();
    return Object.assign(applyCorrections, { configure });

};
