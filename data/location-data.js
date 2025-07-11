const cities = require('./source/cities.json');
const states = require('./source/states');
const countries = require('./source/countries.json');

const hk = states.find(s => s.name === 'Hong Kong SAR');
if (hk) hk.name = 'Hong Kong';

const mo = states.find(s => s.name === 'Macau SAR');
if (mo) mo.name = 'Macau';

module.exports = { cities, states, countries };
