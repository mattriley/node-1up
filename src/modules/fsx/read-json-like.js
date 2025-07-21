const path = require('path');

const parseImplementations = {
    json5: jsonlike => require('json5').parse(jsonlike),
    json: jsonlike => JSON.parse(jsonlike)
};

module.exports = ({ fsp }) => async filepath => {

    const ext = path.parse(filepath).ext.substring(1);
    const parse = parseImplementations[ext];
    if (!parse) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    try {
        const jsonlike = await fsp.readFile(filepath, 'utf8');
        return parse(jsonlike);
    } catch (err) {
        err.data = { filepath };
        throw err;
    }

};
