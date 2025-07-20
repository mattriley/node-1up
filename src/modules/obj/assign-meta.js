module.exports = () => obj => {
    const acc = {}; // mutable accumulator

    for (const [key, val] of Object.entries(obj)) {
        if (!Array.isArray(val)) continue;

        const elements = val.map(el => el?.id ?? el);
        const containsIds = val.some(el => el && typeof el === 'object' && 'id' in el);

        acc[`${key}.count`] = elements.length;
        acc[`${key}.length`] = elements.length;

        if (!containsIds) {
            acc[`${key}.some`] = elements.length > 0;

            for (const el of elements) {
                acc[`${key}.${el}.exists`] = true;
            }
        }
    }

    return acc;
};
