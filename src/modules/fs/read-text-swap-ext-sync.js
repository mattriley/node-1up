const nodepath = require('node:path');

module.exports = ({ self }) => (path, ext) => {

    const { dir, name } = nodepath.parse(path);
    const newPath = nodepath.join(dir, `${name}.${ext}`);
    return self.nodefs.readFileSync(newPath, 'utf8');

};
