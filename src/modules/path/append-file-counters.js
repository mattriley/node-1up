const nodepath = require('path');

module.exports = ({ path }) => (files, sourceKey, destKey = sourceKey) => {

    const allDirnames = files.flatMap(f => path.steps(nodepath.dirname(f[sourceKey])));
    const countByDirname = _.mapValues(_.groupBy(allDirnames), dirs => dirs.length);
    const formatDirname = dir => `${nodepath.basename(dir)} (${countByDirname[dir]})`;
    const dirnameWithCounters = dir => path.steps(dir).map(formatDirname).join(nodepath.sep);

    return files.map(f => {
        const { dir, base } = nodepath.parse(f[sourceKey]);
        if (!dir) return f;
        const newDir = dirnameWithCounters(dir);
        const newPath = nodepath.join(newDir, base);
        return { ...f, [destKey]: newPath };
    });

};
