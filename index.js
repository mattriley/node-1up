const _ = require('lodash');
const modules = require('./src/composed');
module.exports = _.omit(modules, ['fs', 'fsx', 'fsp']);
