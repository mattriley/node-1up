const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config } = {}) => {

    const { configure } = composer(modules);
    const { compose } = configure(defaultConfig, config);
    compose.asis('array');
    compose.make('filesystem', { fs }, { alias: 'fs' });
    compose.asis('function');
    compose.asis('object');
    compose.make('string', {}, { alias: ['s', 'st', 'str'] });
    return compose.end();

};
