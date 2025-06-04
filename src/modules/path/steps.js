module.exports = ({ arr }) => (path, sep = require('path').sep) => {

    return arr.steps(path.split(sep)).map(step => step.join(sep));

};
