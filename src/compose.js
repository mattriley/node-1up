const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config, overrides } = {}) => {

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, overrides, config, defaultConfig });
    const { arr } = compose.asis('arr', {}, { moduleAlias: ['a', 'ar', 'arr'] });
    compose.deep('str', { arr }, { moduleAlias: ['s', 'st', 'str', 'string'] });
    compose.asis('obj', { moduleAlias: ['o', 'ob', 'obj', 'object'] });
    compose.make('fun', {}, { moduleAlias: ['f', 'fn', 'fun', 'func', 'function'] });
    compose.make('fs', {}, { moduleAlias: ['fs', 'filesystem'] });
    compose.asis('any');

    return compose.modules;

};
