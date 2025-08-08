const path = require('path');

module.exports = ({ self, fun, is, fsp, globalConfig }) => config => {

    const defaults = { indent: globalConfig.jsonIndent };
    const parseOptions = fun.parseConfig(defaults, config);

    return async (dirpath, data, ...options) => {
        const { indent } = parseOptions(options);

        if (!is.plainObject(data)) throw new Error('data must be plain object');

        const promises = Object.entries(data).map(async ([key, data]) => {
            const isJson = is.plainObject(data) || Array.isArray(data);
            const ext = isJson ? 'json' : 'txt';
            const file = path.join(dirpath, `${key}.${ext}`);
            const writeJson = (file, data) => self.writeJson(file, data, indent);
            const write = isJson ? writeJson : fsp.writeFile;
            return write(file, data);
        });

        await Promise.all(promises);

    };
};
