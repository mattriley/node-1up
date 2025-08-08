module.exports = ({ self }) => (config = {}) => {
    config = { depth: Infinity, ...config };

    // REFACTOR
    config.delimiters = Array.isArray(config.delimiters) ? config.delimiters : [config.delimiters ?? '.'];

    const splitter = self.buildDelimitersRegex(config.delimiters);

    const splitPath = path => path.split(splitter);

    return (obj, paths, options = {}) => {
        options = { ...config, ...options };
        const { depth } = options;

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
            if (keys.length === 0 || keys.length > depth) continue;

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
