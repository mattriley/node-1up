module.exports = ({ fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.array, config);

    return (arr, ...options) => {
        const { delimiter, finalDelimiter = delimiter } = parseOptions(options);
        const n = Array.isArray(arr) ? arr.length : 0;

        if (n === 0) return '';
        if (n === 1) return String(arr[0] ?? '');

        // Fast path: same delimiter everywhere
        if (finalDelimiter === delimiter) {
            return arr.map(v => String(v ?? '')).join(delimiter);
        }

        // Two items: avoid extra work
        if (n === 2) {
            return String(arr[0] ?? '') + finalDelimiter + String(arr[1] ?? '');
        }

        // General case: join head with delimiter, then add final delimiter + last
        const head = arr.slice(0, -1).map(v => String(v ?? '')).join(delimiter);
        return head + finalDelimiter + String(arr[n - 1] ?? '');
    };
};
