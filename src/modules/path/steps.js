module.exports = ({ arr }) => (pathname, sep = require('path').sep) => {

    return arr.steps(pathname.split(sep)).map(step => step.join(sep));

};
