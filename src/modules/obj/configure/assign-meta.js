module.exports = ({ self, fun }) => config => {

    const defaults = { mutate: true, length: 'length', some: 'some', exists: 'exists' };
    const parseOptions = fun.parseConfig(defaults, config);

    return (obj, ...options) => {
        const { mutate, length, some, exists } = parseOptions(options);

        if (!self.isPlain(obj)) return obj;

        const acc = {}; // holds computed keys

        for (const [key, val] of Object.entries(obj)) {
            if (!Array.isArray(val)) continue;

            const elements = val.map(el => el?.id ?? el);

            const containsIds = val.some(el => el && typeof el === 'object' && 'id' in el);

            acc[`${key}.${length}`] = elements.length;

            if (!containsIds) {
                acc[`${key}.${some}`] = elements.length > 0;

                for (let i = 0; i < elements.length; i++) {
                    const original = val[i];
                    if (typeof original !== 'object' || original === null) {
                        acc[`${key}.${elements[i]}.${exists}`] = true;
                    }
                }
            }
        }

        return mutate ? Object.assign(obj, acc) : { ...obj, ...acc };
    };
};
