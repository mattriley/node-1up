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

const compactInPlace = val => {
    if (!isJsonCompatible(val)) return undefined;
    if (isRemovable(val)) return undefined;

    if (Array.isArray(val)) {
        for (let i = val.length - 1; i >= 0; i--) {
            const item = val[i];
            if (!isJsonCompatible(item)) {
                val.splice(i, 1);
                continue;
            }
            const result = compactInPlace(item);
            if (isRemovable(result)) {
                val.splice(i, 1);
            }
        }
        return val.length ? val : undefined;
    }

    if (typeof val === 'object' && val !== null) {
        for (const key of Object.keys(val)) {
            const item = val[key];
            if (!isJsonCompatible(item)) {
                delete val[key];
                continue;
            }
            const result = compactInPlace(item);
            if (isRemovable(result)) {
                delete val[key];
            }
        }
        return Object.keys(val).length ? val : undefined;
    }

    return val;
};

module.exports = () => compactInPlace;
