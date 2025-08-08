module.exports = ({ fun }) => config => {

    const defaults = { delimiter: '"', allowEscaped: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (str, ...options) => {
        const { delimiter, allowEscaped } = parseOptions(options);

        if (typeof str !== 'string') return str;

        console.warn({ delimiter, allowEscaped });

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
        const esc = allowEscaped ? '\\\\' : '';
        const regex = new RegExp(`^${esc}${escaped}(.*)${esc}${escaped}$`);

        const match = str.match(regex);
        return match ? match[1] : str;

    };
};
