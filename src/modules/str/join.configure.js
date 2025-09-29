module.exports = $ => config => {
    const defaults = { delimiter: ', ', finalDelimiter: ' & ' };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (arr, options) => {
        const { delimiter, finalDelimiter } = parseOptions(options);
        const copy = [...arr];
        const last = copy.pop();
        if (!copy.length) return last;
        const csv = copy.join(delimiter);
        return [csv, last].join(finalDelimiter);
    };
};
