module.exports = () => (config = {}) => {
    config.delimiter ??= ', ';
    config.final ??= ' & ';

    return (arr, delimiter = config.delimiter, final = config.final) => {
        const copy = [...arr];
        const last = copy.pop();
        if (!copy.length) return last;
        const csv = copy.join(delimiter);
        return [csv, last].join(final);
    };
};
