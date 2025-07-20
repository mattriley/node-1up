const DEFAULT_KEYS = ['length', 'some', 'exists'];

module.exports = () => (config = {}) => obj => {

    for (let key of DEFAULT_KEYS) {
        config[key] ??= key;
    }

    const acc = {}; // mutable accumulator

    for (const [key, val] of Object.entries(obj)) {
        if (!Array.isArray(val)) continue;

        const elements = val.map(el => el?.id ?? el);
        const containsIds = val.some(el => el && typeof el === 'object' && 'id' in el);

        acc[`${key}.${config.length}`] = elements.length;

        if (!containsIds) {
            acc[`${key}.${config.some}`] = elements.length > 0;

            for (let i = 0; i < elements.length; i++) {
                const original = val[i];
                // Only apply `.exists` for non-objects (e.g., strings, numbers)
                if (typeof original !== 'object' || original === null) {
                    acc[`${key}.${elements[i]}.${config.exists}`] = true;
                }
            }
        }
    }

    return Object.assign(obj, acc);
};
