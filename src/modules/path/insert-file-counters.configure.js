const path = require('path');

module.exports = $ => config => {
    const defaults = { destKey: undefined };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (files, sourceKey, ...options) => {
        const { destKey = sourceKey } = parseOptions(options);

        const allDirnames = files.flatMap(f => $.path.steps(path.dirname(f[sourceKey])));
        const countByDirname = _.mapValues(_.groupBy(allDirnames), dirs => dirs.length);
        const formatDirname = dir => `${path.basename(dir)} (${countByDirname[dir]})`;
        const dirnameWithCounters = dir => $.path.steps(dir).map(formatDirname).join(path.sep);

        return files.map(f => {
            const sourcePath = f[sourceKey];
            const { dir, base } = path.parse(sourcePath);
            if (!dir) return f;
            const newDir = dirnameWithCounters(dir);
            const destPath = path.join(newDir, base);
            return { ...f, [destKey]: destPath };
        });

    };
};
