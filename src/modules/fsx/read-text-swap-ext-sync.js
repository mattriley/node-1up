const path = require('path');

module.exports = ({ fs }) => (filepath, ext) => {

    const { dir, name } = path.parse(filepath);
    filepath = path.join(dir, `${name}.${ext}`);
    return fs.readFileSync(filepath, 'utf8');

};
