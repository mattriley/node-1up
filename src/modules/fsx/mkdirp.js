const path = require('path');

module.exports = ({ fsp }) => ({ dirpath, filepath }) => {

    const hasDir = typeof dirpath === 'string';
    const hasFile = typeof filepath === 'string';

    if (hasDir === hasFile) {
        throw new Error('Provide exactly one of `dirpath` or `filepath`');
    }

    const targetDir = hasFile ? path.dirname(filepath) : dirpath;

    return fsp.mkdir(targetDir, { recursive: true });
};
