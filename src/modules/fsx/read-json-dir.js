const path = require('path');

module.exports = ({ self, fsp }) => async dirpath => {

    const filenames = await fsp.readdir(dirpath);
    const files = filenames.map(file => path.join(dirpath, file));

    const promises = files.map(async file => {
        const { name, ext } = path.parse(file);
        const readNonJson = file => fsp.readFile(file, 'utf8');
        const read = ext === '.json' ? self.readJson : readNonJson;
        const data = await read(file);
        return [name, data];
    });

    const entries = await Promise.all(promises);
    return Object.fromEntries(entries);

};
