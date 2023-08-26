const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = () => {

    const { configure } = composer(modules);
    const { compose } = configure(defaultConfig);
    compose.asis('array');
    compose.make('filesystem', { fs });
    compose.asis('function');
    compose.asis('object');
    compose.make('string');
    return compose.end();

};
