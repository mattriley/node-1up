module.exports = () => (obj, paths) => {
    const result = {};

    for (const path of paths) {
        const keys = path.split('.');
        let src = obj;
        let tgt = result;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (src == null || typeof src !== 'object' || !(key in src)) break;

            if (i === keys.length - 1) {
                tgt[key] = src[key];
            } else {
                tgt[key] ??= {};
                tgt = tgt[key];
                src = src[key];
            }
        }
    }

    return result;
};
