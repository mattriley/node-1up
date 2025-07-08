const { Country, State } = require('country-state-city');
const citiesWithIata = require('./cities.json');

const allCountries = Country.getAllCountries();
const allStates = State.getAllStates();
const allCities = [...citiesWithIata];

const hk = allStates.find(s => s.name === 'Hong Kong SAR');
if (hk) hk.name = 'Hong Kong';

const mo = allStates.find(s => s.name === 'Macau SAR');
if (mo) mo.name = 'Macau';

const lookupPlan = {
    country: [allCountries, 'name', 'isoCode'],
    state: [allStates, 'name', 'isoCode'],
    city: [allCities, 'name', 'iataCode'],
    statesByCountry: [allStates, 'country', 'countryCode']
};

const lookup = _.mapValues(lookupPlan, args => {
    const [items, ...keyNames] = args;
    return Object.assign(...keyNames.map(keyName => _.groupBy(items, item => item[keyName]?.toLowerCase())));
});

module.exports = { lookup };
