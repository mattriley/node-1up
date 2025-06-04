module.exports = () => (obj, transform) => {

    const namedEntries = Object.entries(obj).map(ent => ({ key: ent[0], val: ent[1] }));
    const transformedEntries = transform(namedEntries);
    const newEntries = transformedEntries.map(ent => Array.isArray(ent) ? ent : [ent.key, ent.val]);
    return Object.fromEntries(newEntries);

};
