module.exports = () => str => {
    if (!str) return '';

    const offsetNums = 0x1D7F6 - '0'.charCodeAt(0); // Offset for digits
    const offsetUpper = 0x1D670 - 'A'.charCodeAt(0); // Offset for uppercase
    const offsetLower = 0x1D68A - 'a'.charCodeAt(0); // Offset for lowercase

    return str.split('').map(char => {
        if (char >= '0' && char <= '9') {
            return String.fromCodePoint(char.charCodeAt(0) + offsetNums);
        }
        if (char >= 'A' && char <= 'Z') {
            return String.fromCodePoint(char.charCodeAt(0) + offsetUpper);
        }
        if (char >= 'a' && char <= 'z') {
            return String.fromCodePoint(char.charCodeAt(0) + offsetLower);
        }
        return char; // Return unchanged if not alphanumeric
    }).join('');

};
