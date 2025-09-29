module.exports = $ => config => {
    const defaults = { depth: Infinity, mutate: false };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (obj, path, value, options) => {
        options = parseOptions(options);

        if (typeof path !== 'string' || path === '') return options.mutate ? obj : { ...obj };

        const keys = path.split('.');
        const limit = Math.min(keys.length, options.depth);

        const base = options.mutate ? obj : structuredClone(obj ?? {}); // or use a deep clone util if needed
        let cursor = base;

        for (let i = 0; i < limit - 1; i++) {
            const key = keys[i];
            if (cursor[key] == null || typeof cursor[key] !== 'object') {
                cursor[key] = {};
            }
            cursor = cursor[key];
        }

        if (limit > 0) {
            cursor[keys[limit - 1]] = value;
        }

        return base;
    };
};
