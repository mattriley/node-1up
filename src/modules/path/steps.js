const { sep: DEFAULT_SEP } = require('path');

module.exports = () => (pathname, sep = DEFAULT_SEP) => {

    const parts = pathname.split(sep).filter(Boolean); // ignore empty parts
    const prefixes = [];
    let acc = '';

    for (const part of parts) {
        acc = acc ? acc + sep + part : part;
        prefixes.push(acc);
    }

    return prefixes;
};
