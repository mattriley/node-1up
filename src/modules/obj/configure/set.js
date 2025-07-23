module.exports = () => (config = {}) => {

    const maxDepth = config.depth ?? Infinity;
    const mutate = config.mutate ?? true;

    return (obj, path, value) => {
        if (typeof path !== 'string' || path === '') return mutate ? obj : { ...obj };

        const keys = path.split('.');
        const limit = Math.min(keys.length, maxDepth);

        const base = mutate ? obj : structuredClone(obj ?? {}); // or use a deep clone util if needed
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
