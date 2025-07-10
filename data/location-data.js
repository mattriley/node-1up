const { Country, State } = require('country-state-city');
const citiesWithIata = require('./cities.json');

const countries = Country.getAllCountries();
const states = require('./states.json');
const cities = [...citiesWithIata];

const hk = states.find(s => s.name === 'Hong Kong SAR');
if (hk) hk.name = 'Hong Kong';

const mo = states.find(s => s.name === 'Macau SAR');
if (mo) mo.name = 'Macau';

module.exports = { cities, states, countries };
