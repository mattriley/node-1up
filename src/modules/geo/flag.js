module.exports = () => code => {

    const codePoints = [...code.toUpperCase()].map(char => 0x1F1E6 - 65 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);

}
