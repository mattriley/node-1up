const fs = require('fs');
const airports = require('./airports.json');

const cities = airports.map(ap => {
    const [countryCode, stateCode] = ap.iso_region.split('-');
    return {
        iataCode: ap.iata,
        city: ap.city,
        state: ap.state || null,
        stateCode: stateCode,
        country: ap.country,
        countryCode: countryCode
    };
});

const dest = __dirname + '/../src/data/cities.json';
fs.writeFileSync(dest, JSON.stringify(cities));
