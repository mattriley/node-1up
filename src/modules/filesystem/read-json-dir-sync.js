const nodepath = require('node:path');

module.exports = ({ io, fs }) => path => {

    const files = io.fs.readdirSync(path);

    const entries = files.map(file => {
        const { name, ext } = nodepath.parse(file);
        const read = ext === '.json' ? fs.readJsonSync : io.fs.readFileSync;
        return [name, read(file)];
    });

    return Object.fromEntries(entries);

};
