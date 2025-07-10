const fs = require('fs');
const airports = require('./source/airports.json');
const airportsByCity = {};
for (const airport of airports) {
    const cityKey = airport.city?.toLowerCase();
    if (!cityKey) continue;
    (airportsByCity[cityKey] ||= []).push(airport);
}
const findAirportsByCity = city => airportsByCity[city.toLowerCase()] ?? [];
let cities = require('./source/cities.json');

cities = cities.map(city => {
    const airports = findAirportsByCity(city.name).filter(airport => {
        const [countryCode] = airport.iso_region.split('-');
        return countryCode === city.countryCode;
    });
    const iataCodes = airports.map(airport => airport.iata);
    const iataCode1 = iataCodes.find(code => city.name.toLowerCase().startsWith(code.toLowerCase()));
    const iataCode2 = city.countryCode === 'AU' ? iataCodes[0] : undefined;
    const iataCode = iataCode1 ?? iataCode2;
    return { ...city, iataCode, iataCodes };
});

const dest = __dirname + '/source/cities-iata.json';
fs.writeFileSync(dest, JSON.stringify(cities, null, 4));
