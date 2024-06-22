module.exports = () => (arr, delimiter = ', ', final = ' & ') => {

    const copy = [...arr];
    const last = copy.pop();
    if (!copy.length) return last;
    const csv = copy.join(delimiter);
    return [csv, last].join(final);

};
