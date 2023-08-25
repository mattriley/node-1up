const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');

module.exports = () => {

    const { compose } = composer(modules);
    compose('fs', { fs });
    compose.asis('lib');
    return compose.end();

};
