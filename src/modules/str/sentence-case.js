module.exports = ({ self }) => {

    const sentenceCase = self.sentenceCaseConfigure();
    sentenceCase.configure = self.sentenceCaseConfigure;
    return sentenceCase;

}
