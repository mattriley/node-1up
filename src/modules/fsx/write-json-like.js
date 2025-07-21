const path = require('path');

const stringifyImplementations = {
    json5: (data, indent) => require('json5').stringify(data, { space: indent }),
    json: (data, indent) => JSON.stringify(data, null, indent)
};

module.exports = ({ fsp, config }) => async (filepath, data, indent = config.indent) => {

    const ext = path.parse(filepath).ext.substring(1);
    const stringify = stringifyImplementations[ext];
    if (!stringify) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    try {
        const jsonlike = stringify(data, indent);
        await fsp.writeFile(filepath, jsonlike);
    } catch (err) {
        err.data = { filepath };
        throw err;
    }

};
