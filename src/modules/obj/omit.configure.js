module.exports = $ => config => {
    const defaults = { depth: Infinity, delimiters: ['.'] };
    const parseOptions = $.fun.parseConfig(defaults, config);
    const regexMemo = {};

    const getRegex = delimiters => {
        const key = JSON.stringify(delimiters);
        const regex = regexMemo[key] ?? $.self.buildDelimitersRegex(delimiters);
        regexMemo[key] ??= regex;
        return regex;
    };

    const cloneContainer = value => {
        if (Array.isArray(value)) return value.slice();
        return { ...value };
    };

    return (obj, paths, options) => {
        options = parseOptions(options);
        const splitter = getRegex(options.delimiters);
        const splitPath = path => path.split(splitter);

        if (obj == null || !Array.isArray(paths)) return {};

        const isFlat = paths.every(p => !splitter.test(p));

        if (isFlat) {
            // Fast flat-omit path
            const omitSet = new Set(paths);
            const result = {};

            for (const key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                if (omitSet.has(key)) continue;
                result[key] = obj[key];
            }

            return result;
        }

        // Structural-sharing deep omit (clone only branches we modify)
        const result = cloneContainer(obj);

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

                if (targetCursor == null || typeof targetCursor !== 'object') {
                    break;
                }

                if (i === keys.length - 1) {
                    // Remove leaf
                    if (key in targetCursor) {
                        delete targetCursor[key];
                    }
                } else {
                    const nextSource = sourceCursor[key];
                    if (nextSource == null || typeof nextSource !== 'object') {
                        break;
                    }

                    const nextTarget = targetCursor[key];

                    // If we're still pointing at the original branch, clone before descending
                    if (nextTarget === nextSource) {
                        targetCursor[key] = cloneContainer(nextSource);
                    } else if (nextTarget == null || typeof nextTarget !== 'object') {
                        // If target doesn't have a usable container, create one so we can descend
                        targetCursor[key] = cloneContainer(nextSource);
                    }

                    targetCursor = targetCursor[key];
                    sourceCursor = nextSource;
                }
            }
        }

        return result;
    };
};
