const nodepath = require('node:path');

module.exports = ({ self }) => path => {

    const files = self.nodefs.readdirSync(path).map(file => nodepath.join(path, file));

    const entries = files.map(file => {
        const { name, ext } = nodepath.parse(file);
        const readNonJson = file => self.nodefs.readFileSync(file, 'utf8');
        const read = ext === '.json' ? self.readJsonSync : readNonJson;
        return [name, read(file)];
    });

    return Object.fromEntries(entries);

};
