module.exports = ({ fun }) => config => {

    const defaults = { delimiter: ', ', final: ' & ' };
    const parseOptions = fun.parseConfig(defaults, config);

    return (arr, ...options) => {
        const { delimiter, final } = parseOptions(options);
        const copy = [...arr];
        const last = copy.pop();
        if (!copy.length) return last;
        const csv = copy.join(delimiter);
        return [csv, last].join(final);
    };

};
