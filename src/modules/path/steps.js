module.exports = ({ arr }) => (path, sep = require('path').sep) => {

    const parts = path.split(sep);
    return arr.steps(parts);

};
