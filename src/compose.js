const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');

module.exports = () => {

    const { compose } = composer(modules);
    compose.asis('array');
    compose.make('filesystem', { fs });
    compose.asis('function');
    compose.asis('object');
    compose.asis('stringify');
    return compose.end();

};
