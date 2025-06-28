module.exports = () => (...args) => {
    let obj, iteratee, mapping;

    for (const arg of args) {
        if (typeof arg === 'function') {
            iteratee = arg;
        } else if (typeof arg === 'string' && arg.includes(':')) {
            mapping = arg;
        } else if (arg && typeof arg === 'object') {
            obj = arg;
        }
    }

    if (!obj || typeof iteratee !== 'function') {
        throw new TypeError('Expected an object and a function');
    }

    let useNamed = false;
    let keyName = 'key', valName = 'val', objName = 'obj';

    if (mapping) {
        const parts = mapping.split(':');
        if (parts.length >= 2) {
            [keyName, valName, objName] = parts;
            useNamed = true;
        }
    }

    const result = {};
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const val = obj[key];
            const newVal = useNamed
                ? iteratee({ [keyName]: key, [valName]: val, [objName]: obj })
                : iteratee(val, key, obj);
            result[key] = newVal;
        }
    }

    return result;
};
