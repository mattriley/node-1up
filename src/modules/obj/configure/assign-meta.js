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

            for (const el of elements) {
                acc[`${key}.${el}.${config.exists}`] = true;
            }
        }
    }

    return Object.assign(obj, acc);
};
