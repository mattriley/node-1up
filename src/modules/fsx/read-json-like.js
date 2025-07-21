const path = require('path');

module.exports = ({ fsp }) => async filepath => {

    const parseImplementations = {
        json5: () => require('json5').parse(jsonLike),
        json: () => JSON.parse(jsonLike)
    };

    const ext = path.parse(filepath).ext.substring(1);
    const parse = parseImplementations[ext];
    if (!parse) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    const jsonLike = await fsp.readFile(filepath, 'utf8');
    return parse();

};
