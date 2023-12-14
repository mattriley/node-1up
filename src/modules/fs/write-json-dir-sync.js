const nodepath = require('node:path');

module.exports = ({ self, config }) => (path, data, indent = config.indent) => {

    if (!_.isPlainObject(data)) throw new Error('data must be plain object');

    Object.entries(data).forEach(([key, data]) => {
        const isJson = _.isPlainObject(data) || Array.isArray(data);
        const ext = isJson ? 'json' : 'txt';
        const file = nodepath.join(path, `${key}.${ext}`);
        const writeJson = (file, data) => self.writeJsonSync(file, data, indent);
        const write = isJson ? writeJson : self.nodefs.writeFileSync;
        write(file, data);
    });

};
