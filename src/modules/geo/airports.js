// Data source: https://github.com/baba-mandef/air-codes/blob/main/data/airports.json

module.exports = () => () => {

    let airports; // Lazy load

    if (!airports) {
        const airports = require('../../data/airports.json');
    }

    return airports;;

};
