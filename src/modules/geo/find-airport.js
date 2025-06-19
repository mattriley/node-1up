const { getAirportByIata } = require("aircodes");

module.exports = () => iataCode => {

    return getAirportByIata(iataCode.toUpperCase())

};
