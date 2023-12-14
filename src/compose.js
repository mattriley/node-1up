const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config, overrides } = {}) => {

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, overrides, config, defaultConfig });
    const { io } = compose.make('io');
    const { arr } = compose.asis('arr', {}, { moduleAlias: ['a', 'ar', 'arr'] });
    compose.make('fun', {}, { moduleAlias: ['f', 'fn', 'fun', 'func', 'function'] });
    compose.make('fs', { io }, { moduleAlias: ['fs', 'filesystem'] });
    compose.asis('obj', { moduleAlias: ['o', 'ob', 'obj', 'object'] });
    compose.asis('any');
    compose.deep('str', { arr }, { moduleAlias: ['s', 'st', 'str', 'string'] });

    return _.omit(compose.modules, 'io');

};
