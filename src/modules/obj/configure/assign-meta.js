const DEFAULT_KEYS = ['length', 'some', 'exists'];

module.exports = ({ self }) => (config = {}) => {
    config.mutate ??= true;
    for (const key of DEFAULT_KEYS) config[key] ??= key;

    return (obj, options = {}) => {
        options.mutate ??= config.mutate;

        if (!self.isPlain(obj)) return obj;

        const acc = {}; // holds computed keys

        for (const [key, val] of Object.entries(obj)) {
            if (!Array.isArray(val)) continue;

            const elements = val.map(el => el?.id ?? el);
            const containsIds = val.some(el => el && typeof el === 'object' && 'id' in el);

            acc[`${key}.${config.length}`] = elements.length;

            if (!containsIds) {
                acc[`${key}.${config.some}`] = elements.length > 0;

                for (let i = 0; i < elements.length; i++) {
                    const original = val[i];
                    if (typeof original !== 'object' || original === null) {
                        acc[`${key}.${elements[i]}.${config.exists}`] = true;
                    }
                }
            }
        }

        return options.mutate ? Object.assign(obj, acc) : { ...obj, ...acc };
    };
};
