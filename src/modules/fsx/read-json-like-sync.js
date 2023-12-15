const nodepath = require('node:path');

module.exports = ({ self }) => path => {

    const parseImplementations = {
        json5: () => require('json5').parse(jsonLike),
        json: () => JSON.parse(jsonLike)
    };

    const ext = nodepath.parse(path).ext.substring(1);
    const parse = parseImplementations[ext];
    if (!parse) throw new Error(`Unrecognised JSON-like extension: ${ext}`);

    const jsonLike = self.nodefs.readFileSync(path, 'utf8');
    return parse();

};
