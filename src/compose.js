const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');
const buildLookups = require('./build-lookups');

const outerCompose = ({ config, overrides = {} } = {}) => {

    const os = overrides.os ?? require('os');
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
    const { arr } = compose.make('arr', { fun, is });
    const { obj } = compose.deep('obj', { fun, arr, is });
    const { str } = compose.deep('str', { fun, arr });
    const { net } = compose.make('net');
    const { date } = compose.make('date', { str, obj });
    const { fsx } = compose.make('fsx', { fun, is, os, fs, fsp });

    compose.deep('geo', { str, arr, net });
    compose.make('bool');
    compose.make('path', { fun, arr, fsx, os });
    compose.make('pipe', { is, fun });
    compose.deep('exif', { obj, date });
    compose.make('img');
    compose.make('proc');

    return {
        ...compose.modules,
        configure: config => outerCompose({ config })
    };

};

module.exports = outerCompose;
