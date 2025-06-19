// Data source: https://github.com/aashishvanand/airport-data-js/blob/main/data/airports.json

module.exports = () => () => {

    const allAirports = require('../../data/airports.json');

    return allAirports.map(ap => {
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

}
