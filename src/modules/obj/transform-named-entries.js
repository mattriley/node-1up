module.exports = () => (names, obj, transform) => {

    const [keyName, valName] = Array.isArray(names) ? names : names.split(':');
    const entries = Object.entries(obj);
    const namedEntries = entries.map(ent => ({ [keyName]: ent[0], [valName]: ent[1] }));
    const transformedEntries = transform(namedEntries);
    const newEntries = transformedEntries.map(ent => Array.isArray(ent) ? ent : [ent[keyName], ent[valName]]);
    return Object.fromEntries(newEntries);

};
