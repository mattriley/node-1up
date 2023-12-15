const nodepath = require('node:path');

module.exports = ({ self }) => path => {

    const { ext } = nodepath.parse(path);
    const jsonLike = self.nodefs.readFileSync(path, 'utf8');
    const parse = ext === '.json5' ? require('json5').parse : JSON.parse;
    return parse(jsonLike);

};
