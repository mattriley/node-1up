const nodepath = require('node:path');

module.exports = ({ self, config }) => async (path, data, indent = config.indent) => {

    if (!_.isPlainObject(data)) throw new Error('data must be plain object');

    const promises = Object.entries(data).map(async ([key, data]) => {
        const isJson = _.isPlainObject(data) || Array.isArray(data);
        const ext = isJson ? 'json' : 'txt';
        const file = nodepath.join(path, `${key}.${ext}`);
        const writeJson = (file, data) => self.writeJson(file, data, indent);
        const write = isJson ? writeJson : self.nodefs.promises.writeFile;
        return write(file, data);
    });

    await Promise.all(promises);

};
