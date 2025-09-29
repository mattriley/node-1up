const path = require('path');

module.exports = $ => input => {
    let dirpath, filepath;

    // Support single string argument as dirpath
    if (typeof input === 'string') {
        dirpath = input;
    } else if (typeof input === 'object' && input !== null) {
        ({ dirpath, filepath } = input);
    } else {
        throw new Error('Invalid input: must be a string or an object with `dirpath` or `filepath`');
    }

    const hasDir = typeof dirpath === 'string';
    const hasFile = typeof filepath === 'string';

    if (hasDir === hasFile) {
        throw new Error('Provide exactly one of `dirpath` or `filepath`');
    }

    const targetDir = hasFile ? path.dirname(filepath) : dirpath;

    return $.fsp.mkdir(targetDir, { recursive: true });
};
