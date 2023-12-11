const nodepath = require('node:path');

module.exports = ({ io, fs, config }) => (path, data, indent = config.indent) => {

    if (!_.isPlainObject(data)) throw new Error('data must be plain object');

    Object.entries(data).forEach(([key, data]) => {
        const isJson = _.isPlainObject(data) || Array.isArray(data);
        const ext = isJson ? 'json' : 'txt';
        const file = nodepath.join(path, `${key}.${ext}`);
        const writeJson = (file, data) => fs.writeJsonSync(file, data, indent);
        const write = isJson ? writeJson : io.fs.writeFileSync;
        write(file, data);
    });

};
