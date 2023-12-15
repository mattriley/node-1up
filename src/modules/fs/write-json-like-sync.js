const nodepath = require('node:path');

module.exports = ({ self, config }) => (path, data, indent = config.indent) => {

    const stringifyImplementations = {
        json5: () => require('json5').stringify(data, { space: indent }),
        json: () => JSON.stringify(data, null, indent)
    };

    const ext = nodepath.parse(path).ext.substring(1);
    const stringify = stringifyImplementations[ext];
    if (!stringify) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    const jsonLike = stringify();
    return self.nodefs.writeFileSync(path, jsonLike);

};
