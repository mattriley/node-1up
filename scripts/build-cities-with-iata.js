const _ = require('lodash');
const fs = require('fs');
const airports = require('./airports.json'); // https://github.com/aashishvanand/airport-data-js/blob/main/data/airports.json
const airportsByCity = _.groupBy(airports, airport => airport.city.toLowerCase());
const findAirportsByCity = city => airportsByCity[city.toLowerCase()] ?? [];
const { City } = require('country-state-city');

const cities = City.getAllCities().map(city => {
    const airports = findAirportsByCity(city.name).filter(airport => {
        const [countryCode] = airport.iso_region.split('-');
        return countryCode === city.countryCode;
    });
    const iataCodes = airports.map(airport => airport.iata);
    const iataCode = iataCodes.find(code => {
        if (city.countryCode === 'AU') return code;
        if (city.name.toLowerCase().startsWith(code.toLowerCase())) return code;
    });
    return { ...city, iataCode, iataCodes };
});

const dest = __dirname + '/../src/data/cities.json';
fs.writeFileSync(dest, JSON.stringify(cities, null, 4));
