const path = require('path');

module.exports = ({ fsp, config }) => async (filepath, data, indent = config.indent) => {

    const stringifyImplementations = {
        json5: () => require('json5').stringify(data, { space: indent }),
        json: () => JSON.stringify(data, null, indent)
    };

    const ext = path.parse(filepath).ext.substring(1);
    const stringify = stringifyImplementations[ext];
    if (!stringify) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    const jsonLike = stringify();
    return fsp.writeFile(filepath, jsonLike);

};
