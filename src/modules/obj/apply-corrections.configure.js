module.exports = ({ self, fun }) => config => {
    const defaults = { mutate: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (obj, remap, options) => {
        const { mutate } = parseOptions(options);

        if (!self.isPlain(obj) || !remap) return obj;

        const lookupByField = self.transformEntries('key:corrections', remap, entries => {
            return entries.map(({ key, corrections }) => {
                const lookup = {};

                for (const group of corrections) {
                    const values = Array.isArray(group) ? group : [group];
                    const preferred = values[0];

                    for (const val of values) {
                        const lower = String(val).toLowerCase();
                        if (!(lower in lookup)) {
                            lookup[lower] = preferred;
                        }
                    }
                }

                return [key, lookup];
            });
        });

        const target = mutate ? obj : { ...obj };

        for (const [key, lookup] of Object.entries(lookupByField)) {
            const original = obj[key];

            if (!original) {
                target[key] = original;
                continue;
            }

            if (Array.isArray(original)) {
                target[key] = original.map(val => {
                    const lower = val?.toLowerCase?.();
                    return lower && lower in lookup ? lookup[lower] : val;
                });
            } else {
                const lower = original?.toLowerCase?.();
                target[key] = lower && lower in lookup ? lookup[lower] : original;
            }
        }

        return target;
    };

};
