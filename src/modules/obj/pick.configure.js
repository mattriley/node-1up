module.exports = ({ self, fun }) => config => {

    const defaults = { depth: Infinity, delimiters: ['.'] };
    const parseOptions = fun.parseConfig(defaults, config);
    const regexMemo = {};

    const getRegex = delimiters => {
        const key = JSON.stringify(delimiters);
        const regex = regexMemo[key] ?? self.buildDelimitersRegex(delimiters);
        regexMemo[key] ??= regex;
        return regex;
    };

    return (obj, paths, ...options) => {
        const { depth, delimiters } = parseOptions(options);
        const splitter = getRegex(delimiters);
        const splitPath = path => path.split(splitter);

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
