const _ = require('lodash');
const compose = require('./compose');
module.exports = _.omit(compose(), 'io');
