const fs = require('fs');
const path = require('path');

const airports = require('./source/airports.json');
const cities = require('./source/cities.json');

const airportsByCity = {};
for (const airport of airports) {
    const cityName = airport.city?.toLowerCase();
    if (cityName) {
        (airportsByCity[cityName] ||= []).push(airport);
    }
}

const findAirportsByCity = cityName =>
    airportsByCity[cityName.toLowerCase()] ?? [];

const getMatchingAirports = (city) =>
    findAirportsByCity(city.name).filter(airport => {
        const [countryCode] = airport.iso_region.split('-');
        return countryCode === city.countryCode;
    });

const citiesIata = cities.map(city => {
    const matchingAirports = getMatchingAirports(city);
    const iataCodes = matchingAirports
        .map(airport => airport.iata)
        .filter(Boolean);

    const iataCode1 = iataCodes.find(code =>
        city.name.toLowerCase().startsWith(code.toLowerCase())
    );
    const iataCode2 = city.countryCode === 'AU' ? iataCodes[0] : undefined;
    const iataCode = iataCode1 ?? iataCode2;

    return { ...city, iataCode, iataCodes };
});

const destPath = path.join(__dirname, 'source', 'cities-iata.json');
fs.writeFileSync(destPath, JSON.stringify(citiesIata, null, 4));
