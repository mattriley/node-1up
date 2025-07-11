const airports = require('./source/airports.json');
const cities = require('./source/cities.json');
const states = require('./source/states.json');
const countries = require('./source/countries.json');

cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
    city.stateCode = city.countryCode;
    city.countryCode = 'CN';
});

airports.filter(airport => ['Hong Kong', 'Macau'].includes(airport.country)).forEach(airport => {
    airport.country = 'China';
});

module.exports = { cities, states, countries };
