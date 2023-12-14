module.exports = (val, delimiter = ',') => {

    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.toString().split(delimiter).map(s => s.trim()).filter(s => !!s);

};
