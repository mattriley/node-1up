module.exports = $ => config => {
    const defaults = { delimiter: ', ', finalDelimiter: ' & ' };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (arr, delimiter, finalDelimiter, options) => {
        options = parseOptions({ delimiter, finalDelimiter, ...options });

        const copy = [...arr];
        const last = copy.pop();
        if (!copy.length) return last;
        const csv = copy.join(options.delimiter);
        return [csv, last].join(options.finalDelimiter);
    };
};
