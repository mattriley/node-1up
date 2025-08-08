module.exports = ({ fun }) => config => {
    const defaults = { delimiter: ', ', final: ' & ' };
    const parseArgs = fun.parseConfig(defaults, config);

    return (arr, ...args) => {
        const { delimiter, final } = parseArgs(...args);
        const copy = [...arr];
        const last = copy.pop();
        if (!copy.length) return last;
        const csv = copy.join(delimiter);
        return [csv, last].join(final);
    };
};
