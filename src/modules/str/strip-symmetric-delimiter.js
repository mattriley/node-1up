// Generated and optimised on 21 June 2025 with help from ChatGPT.

module.exports = () => (str, delimiter = '"', { allowEscaped = false } = {}) => {

    if (typeof str !== 'string') return str;

    if (typeof delimiter !== 'string' || delimiter.length !== 1) {
        throw new TypeError('Delimiter must be a single character string');
    }

    // Fast path check: skip regex if string doesn't start and end with delimiter
    if (
        (!allowEscaped && (str[0] !== delimiter || str.at(-1) !== delimiter)) ||
        (allowEscaped && (str.slice(0, 2) !== `\\${delimiter}` || str.slice(-2) !== `\\${delimiter}`))
    ) {
        return str;
    }

    // Escape delimiter for regex
    const escaped = delimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const esc = allowEscaped ? '\\' : '';
    const regex = new RegExp(`^${esc}${escaped}(.*)${esc}${escaped}$`);

    const match = str.match(regex);
    return match ? match[1] : str;

};
