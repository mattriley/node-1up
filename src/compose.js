const fs = require('fs');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config } = {}) => {

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, config, defaultConfig });
    compose.asis('array', { moduleAlias: ['a', 'ar', 'arr'] });
    compose.make('filesystem', { fs }, { moduleAlias: ['fs'] });
    compose.asis('function', { moduleAlias: ['f', 'fn', 'fun', 'func'] });
    compose.asis('object', { moduleAlias: ['o', 'ob', 'obj'] });
    return compose.make('string', {}, { moduleAlias: ['s', 'st', 'str'] });

};
