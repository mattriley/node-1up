module.exports = () => (config = {}) => {
    config.depth ??= Infinity;

    const delimiters = Array.isArray(config.delimiters)
        ? config.delimiters
        : [config.delimiters ?? '.'];

    // Generate regex for multi-char or single-char delimiters
    const sortedDelims = [...delimiters].sort((a, b) => b.length - a.length);
    const delimiterPattern = sortedDelims
        .map(d => d.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
        .join('|');
    const splitter = new RegExp(delimiterPattern);

    const splitPath = path => path.split(splitter);

    return (obj, paths, options = {}) => {
        options.depth ??= config.depth;

        if (obj == null || !Array.isArray(paths)) return {};

        const result = {};

        const isFlat = paths.every(p => !splitter.test(p));

        if (isFlat) {
            // Fast flat-pick path
            for (const key of paths) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    result[key] = obj[key];
                }
            }
            return result;
        }

        // Full deep path extractor
        for (const path of paths) {
            const keys = splitPath(path);
            if (keys.length === 0 || keys.length > options.depth) continue;

            let sourceCursor = obj;
            let targetCursor = result;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (sourceCursor == null || typeof sourceCursor !== 'object' || !(key in sourceCursor)) {
                    break;
                }

                if (i === keys.length - 1) {
                    targetCursor[key] = sourceCursor[key];
                } else {
                    if (targetCursor[key] == null || typeof targetCursor[key] !== 'object') {
                        targetCursor[key] = {};
                    }
                    targetCursor = targetCursor[key];
                    sourceCursor = sourceCursor[key];
                }
            }
        }

        return result;
    };
};
