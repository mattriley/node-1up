const _ = require('lodash');
const fs = require('fs');
const airports = require('./airports.json'); // https://github.com/aashishvanand/airport-data-js/blob/main/data/airports.json
const countries = require('country-state-city').Country.getAllCountries();
const countriesByCode = _.keyBy(countries, 'code');

const cities = airports.map(airport => {
    const { iata: iataCode, city, state } = airport;
    const [countryCode, stateCode] = airport.iso_region.split('-');
    const country = countriesByCode[countryCode];
    return { iataCode, city, state, stateCode, country, countryCode };
});

const dest = __dirname + '/../src/data/cities.json';
fs.writeFileSync(dest, JSON.stringify(cities));
