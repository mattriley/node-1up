const nodepath = require('node:path');

module.exports = ({ self }) => async path => {

    const parseImplementations = {
        json5: () => require('json5').parse(jsonLike),
        json: () => JSON.parse(jsonLike)
    };

    const ext = nodepath.parse(path).ext.substring(1);
    const parse = parseImplementations[ext];
    if (!parse) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    const jsonLike = await self.nodefs.promises.readFile(path, 'utf8');
    return parse();

};
