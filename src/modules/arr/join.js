module.exports = (arr, sep, lastSep) => {

    const items = [...arr];
    if (items.length === 1) return items[0];
    const last = items.pop();
    return items.join(sep) + lastSep + last;

};
