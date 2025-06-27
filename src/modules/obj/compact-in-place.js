const isRemovable = val =>
    val === undefined ||
    val === null ||
    val === '' ||
    (Array.isArray(val) && val.length === 0) ||
    (typeof val === 'object' && val !== null && Object.keys(val).length === 0);

const isJsonCompatible = val => {
    const t = typeof val;
    return (
        val === null ||
        t === 'boolean' ||
        t === 'number' ||
        t === 'string' ||
        Array.isArray(val) ||
        (t === 'object' && val.constructor === Object)
    );
};

const compactInPlace = obj => {
    if (Array.isArray(obj)) {
        for (let i = obj.length - 1; i >= 0; i--) {
            const item = obj[i];
            if (!isJsonCompatible(item)) {
                obj.splice(i, 1);
                continue;
            }
            const result = compactInPlace(item);
            if (isRemovable(result)) {
                obj.splice(i, 1);
            }
        }
        return obj;
    }

    if (typeof obj === 'object' && obj !== null) {
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (!isJsonCompatible(val)) {
                delete obj[key];
                continue;
            }
            const result = compactInPlace(val);
            if (isRemovable(result)) {
                delete obj[key];
            }
        }
    }

    return obj;
};

module.exports = () => compactInPlace;
