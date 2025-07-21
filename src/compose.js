const _ = require('lodash');
const composer = require('module-composer');
const modules = require('./modules');
const defaultConfig = require('./default-config');
const buildLookups = require('./build-lookups');

const outerCompose = ({ config, overrides = {} } = {}) => {

    const fs = overrides.fs ?? require('fs');
    const fsp = overrides.fsp ?? fs.promises;

    Object.assign(globalThis, { _ });

    const functionAlias = [['Value', 'Val']];
    const { compose } = composer(modules, { functionAlias, overrides, defaultConfig, config: [config, buildLookups] });

    const { is } = compose.make('is');
    const { arr } = compose.make('arr', { is });
    const { fun } = compose.make('fun', { is });
    const { net } = compose.make('net');

    compose.deep('obj', { is, arr });
    compose.deep('str', { arr });
    compose.make('fsx', { is, fs, fsp });
    compose.asis('any');
    compose.deep('geo', { arr, net });
    compose.make('bool');
    compose.make('path', { arr });
    compose.make('pipe', { is, fun });
    compose.deep('exif');

    return {
        ...compose.modules,
        configure: config => outerCompose({ config })
    }

};

module.exports = outerCompose;
