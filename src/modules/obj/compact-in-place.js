module.exports = ({ is }) => {

    const isRemovable = val =>
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'object' && val !== null && Object.keys(val).length === 0);

    const compactInPlace = val => {
        if (!is.jsonCompatible(val)) return undefined;
        if (isRemovable(val)) return undefined;

        if (Array.isArray(val)) {
            for (let i = val.length - 1; i >= 0; i--) {
                const item = val[i];
                if (!is.jsonCompatible(item)) {
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
                if (!is.jsonCompatible(item)) {
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

    return compactInPlace;
};
