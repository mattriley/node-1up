const nodepath = require('node:path');

module.exports = ({ self }) => async path => {

    const filenames = await self.nodefs.readdir(path);
    const files = filenames.map(file => nodepath.join(path, file));

    const promises = files.map(async file => {
        const { name, ext } = nodepath.parse(file);
        const readNonJson = file => self.nodefs.promises.readFile(file, 'utf8');
        const read = ext === '.json' ? self.readJson : readNonJson;
        const data = await read(file);
        return [name, data];
    });

    const entries = await Promise.all(promises);
    return Object.fromEntries(entries);

};
