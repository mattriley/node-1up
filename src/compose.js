const composer = require('module-composer');
const modules = require('./modules');

module.exports = () => {

    const { compose } = composer(modules);
    compose.asis('lib');
    return compose.end();

};
