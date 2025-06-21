const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config, overrides } = {}) => {

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, overrides, config, defaultConfig });

    const { is } = compose.make('is');
    const { arr } = compose.make('arr', { is });

    compose.make('obj', { is, arr });
    compose.deep('str', { arr });
    compose.make('fun', { is });
    compose.make('fsx');
    compose.make('fsp', { is });
    compose.asis('any');
    compose.make('geo', { arr });
    compose.make('bool');
    compose.make('path', { arr });

    return compose.modules;

};
