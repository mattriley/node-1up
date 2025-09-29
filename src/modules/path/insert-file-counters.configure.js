const path = require('path');

module.exports = $ => config => {
    const defaults = { destKey: undefined, valueKey: 'value' };
    const parseOptions = $.fun.parseConfig(defaults, config);

    // Extract plain string segments from a sourcePath (string or array of segment objects)
    const toStringSegments = (sourcePath, valueKey) => {
        if (typeof sourcePath === 'string') {
            // Drop empty segments so trailing slashes don't produce blanks
            const parts = sourcePath.split(path.sep);
            const out = [];
            for (let i = 0; i < parts.length; i++) {
                const p = parts[i];
                if (p.length > 0) out.push(p);
            }
            return out;
        }
        // Assume array of objects like [{ [valueKey]: 'a' }, ...]
        const out = new Array(sourcePath.length);
        for (let i = 0; i < sourcePath.length; i++) {
            out[i] = sourcePath[i][valueKey];
        }
        return out;
    };

    // Given segments, return { dir, base } similar to node:path.parse but for pre-tokenised arrays
    const dirBaseFromSegments = segs => {
        const n = segs.length;
        if (n === 0) return { dir: '', base: '' };
        if (n === 1) return { dir: '', base: segs[0] };
        const dir = segs.slice(0, n - 1).join(path.sep);
        const base = segs[n - 1];
        return { dir, base };
    };

    return (files, sourceKey, options) => {
        const { destKey = sourceKey, valueKey } = parseOptions(options);

        // Build the multiset of all cumulative directory paths across all files
        // using $.path.steps on the directory string per file.
        const allDirnames = files.flatMap(f => {
            const src = f[sourceKey];
            if (typeof src === 'string') {
                return $.path.steps(path.dirname(src));
            }
            const segs = toStringSegments(src, valueKey);
            const { dir } = dirBaseFromSegments(segs);
            return $.path.steps(dir);
        });

        const countByDirname = _.mapValues(_.groupBy(allDirnames), dirs => dirs.length);

        const formatDirname = dir => `${path.basename(dir)} (${countByDirname[dir]})`;
        const dirnameWithCounters = dir => $.path.steps(dir).map(formatDirname).join(path.sep);

        return files.map(f => {
            const src = f[sourceKey];

            // Derive dir/base for both string and array forms
            let dir, base;
            if (typeof src === 'string') {
                const parsed = path.parse(src);
                dir = parsed.dir;
                base = parsed.base;
            } else {
                const segs = toStringSegments(src, valueKey);
                const db = dirBaseFromSegments(segs);
                dir = db.dir;
                base = db.base;
            }

            if (!dir) return f; // keep behaviour: root files unchanged

            const newDir = dirnameWithCounters(dir);
            const destPath = path.join(newDir, base);

            return { ...f, [destKey]: destPath };
        });
    };
};
