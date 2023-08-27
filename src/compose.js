const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config } = {}) => {

    const functionAlias = {
        Value: 'Val'
    };

    const { configure } = composer(modules, { functionAlias });
    const { compose } = configure(defaultConfig, config);

    compose
        .opts({ moduleAlias: ['a', 'ar', 'arr'] })
        .make('array');

    compose
        .opts({ moduleAlias: ['fs'] })
        .make('filesystem', { fs });

    compose
        .opts({ moduleAlias: ['f', 'fn', 'fun', 'func'] })
        .make('function');

    compose
        .opts({ moduleAlias: ['o', 'ob', 'obj'] })
        .make('object');

    compose
        .opts({ moduleAlias: ['s', 'st', 'str'] })
        .make('string', {});

    return compose.end();

};
