const nodepath = require('node:path');

module.exports = ({ io, fs }) => path => {

    const files = io.fs.readdirSync(path).map(file => nodepath.join(path, file));

    const entries = files.map(file => {
        const { name, ext } = nodepath.parse(file);
        const readNonJson = file => io.fs.readFileSync(file, 'utf8');
        const read = ext === '.json' ? fs.readJsonSync : readNonJson;
        return [name, read(file)];
    });

    return Object.fromEntries(entries);

};
