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

    compose('array', null, { moduleAlias: ['a', 'ar', 'arr'] });
    compose('filesystem', { fs }, { moduleAlias: ['fs'] });
    compose('function', null, { moduleAlias: ['f', 'fn', 'fun', 'func'] });
    compose('object', null, { moduleAlias: ['o', 'ob', 'obj'] });
    compose('string', {}, { moduleAlias: ['s', 'st', 'str'] });

    return compose.end();

};
