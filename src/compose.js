const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');

module.exports = ({ config, overrides } = {}) => {

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, overrides, config, defaultConfig });
    const { arr } = compose.asis('arr');
    compose.deep('str', { arr });
    compose.make('obj', { arr });
    compose.make('fun');
    compose.make('fsx');
    compose.make('fsp');
    compose.asis('any');
    compose.make('path', { arr });

    return compose.modules;

};
