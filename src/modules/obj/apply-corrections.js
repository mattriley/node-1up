module.exports = ({ self }) => (obj, remap) => {

    if (!self.isPlain(obj) || !remap) return obj;

    const lookupByField = self.obj.transformEntries('key:corrections', remap, entries => {
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

    const changes = {};

    for (const [key, lookup] of Object.entries(lookupByField)) {
        const original = obj[key];

        if (!original) {
            changes[key] = original;
            continue;
        }

        if (Array.isArray(original)) {
            changes[key] = original.map(val => {
                const lower = val?.toLowerCase?.();
                return lower && lower in lookup ? lookup[lower] : val;
            });
        } else {
            const lower = original?.toLowerCase?.();
            changes[key] = lower && lower in lookup ? lookup[lower] : original;
        }
    }

    return { ...obj, ...changes };
};
