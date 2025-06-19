module.exports = (list, pred, cont) => {

    const vals = list.filter(pred);
    const only = vals.length === 1 ? vals[0] : null;
    const many = vals.length > 1 ? vals : null;

    if (!cont) return only;
    if (Array.isArray(cont)) return cont.concat([only, many, vals]);
    if (_.isPlainObject(cont)) return { ...cont, only, many, vals };
    throw new Error('Unsupported container');

};
