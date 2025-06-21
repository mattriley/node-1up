module.exports = ({ is }) => (vals, cont) => {

    const only = vals.length === 1 ? vals[0] : null;
    const many = vals.length > 1 ? vals : null;

    if (Array.isArray(cont)) return cont.concat([only, many, vals]);
    if (is.plainObject(cont)) return { ...cont, only, many, vals };

    return only;

};
