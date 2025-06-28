module.exports = () => (...args) => {
    let names = 'key:val';
    let obj, transform;

    for (const arg of args) {
        if (typeof arg === 'function') {
            transform = arg;
        } else if (typeof arg === 'string' && arg.includes(':')) {
            names = arg;
        } else if (Array.isArray(arg) && arg.length === 2 && arg.every(x => typeof x === 'string')) {
            names = arg;
        } else if (arg && typeof arg === 'object') {
            obj = arg;
        }
    }

    if (!obj || typeof transform !== 'function') {
        throw new TypeError('Expected an object and a transform function');
    }

    const [keyName, valName] = Array.isArray(names) ? names : names.split(':');

    const entries = Object.entries(obj);
    const namedEntries = entries.map(([k, v]) => ({ [keyName]: k, [valName]: v }));
    const transformed = transform(namedEntries);

    const newEntries = transformed.map(ent =>
        Array.isArray(ent) ? ent : [ent[keyName], ent[valName]]
    );

    return Object.fromEntries(newEntries);
};
