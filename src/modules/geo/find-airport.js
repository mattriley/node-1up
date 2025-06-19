module.exports = () => iataCode => {

    let airportsByCode; // Lazy load

    if (!airportsByCode) {
        const airports = require('../../data/airports.json');
        airportsByCode = _.keyBy(airports, airport => airport.iata.toLowerCase());
    }

    return airportsByCode[iataCode];

};
