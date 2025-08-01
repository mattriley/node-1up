const ctz = require("country-timezone");

module.exports = () => ({ countries }) => {

    return countries.map(country => {
        const timezones = ctz.getTimezones(country.name);
        return { ...country, timezones };
    });

};
