const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');
const buildLookups = require('./build-lookups');

const outerCompose = ({ config, overrides = {} } = {}) => {

    const fs = overrides.fs ?? require('fs');
    const fsp = overrides.fsp ?? fs.promises;

    Object.assign(globalThis, { _ });

    const composerOptions = {
        overrides,
        defaultConfig,
        config: [config, buildLookups],
        configAlias: ['globalConfig'],
        functionAlias: [['Value', 'Val']]
    };

    const { compose } = composer(modules, composerOptions);

    const { is } = compose.make('is');
    const { fun } = compose.make('fun', { is });
    const { arr } = compose.deep('arr', { fun, is });
    const { obj } = compose.deep('obj', { fun, arr, is });
    const { str } = compose.deep('str', { fun, arr });
    const { net } = compose.make('net');
    const { date } = compose.make('date', { obj });

    compose.deep('fsx', { fun, is, fs, fsp });
    compose.deep('geo', { str, arr, net });
    compose.make('bool');
    compose.deep('path', { fun, arr });
    compose.make('pipe', { is, fun });
    compose.deep('exif', { obj, date });
    compose.deep('img');

    return {
        ...compose.modules,
        configure: config => outerCompose({ config })
    }

};

module.exports = outerCompose;
