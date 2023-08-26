const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config } = {}) => {

    const { configure } = composer(modules);
    const { compose } = configure(defaultConfig, config);

    compose
        .opts({ alias: ['a', 'ar', 'arr'] })
        .asis('array');

    compose
        .opts({ alias: ['fs'] })
        .make('filesystem', { fs });

    compose
        .opts({ alias: ['f', 'fn', 'fun', 'func'] })
        .asis('function');

    compose
        .opts({ alias: ['o', 'ob', 'obj'] })
        .asis('object');

    compose
        .opts({ alias: ['s', 'st', 'str'] })
        .make('string');

    return compose.end();

};
