const cities = require('./source/cities.json');
const states = require('./source/states');
const countries = require('./source/countries.json');

const hongkongState = states.find(s => s.name === 'Hong Kong SAR');
if (hongkongState) hongkongState.name = 'Hong Kong';

const hongkongCity = cities.find(c => c.name === 'Hong Kong');
if (hongkongCity) hongkongCity.stateCode = hongkongState.isoCode;

const macauState = states.find(s => s.name === 'Macau SAR');
if (macauState) macauState.name = 'Macau';

const macauCity = cities.find(c => c.name === 'Macau');
if (macauCity) macauCity.stateCode = macauState.isoCode;

module.exports = { cities, states, countries };
