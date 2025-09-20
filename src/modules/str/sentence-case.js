module.exports = ({ self }) => {

    const configure = self.sentenceCaseConfigure;
    const sentenceCase = configure();
    return Object.assign(sentenceCase, { configure });

};
