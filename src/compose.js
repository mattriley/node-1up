const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config, overrides } = {}) => {

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, overrides, config, defaultConfig });
    const { io } = compose.make('io');
    const { arr } = compose.asis('array', { moduleAlias: ['a', 'ar', 'arr'] });
    compose.make('filesystem', { io }, { moduleAlias: ['fs'] });
    compose.make('function', {}, { moduleAlias: ['f', 'fn', 'fun', 'func'] });
    compose.asis('object', { moduleAlias: ['o', 'ob', 'obj'] });
    compose.asis('any');

    return compose.make('string', { arr }, { moduleAlias: ['s', 'st', 'str'] });

};
