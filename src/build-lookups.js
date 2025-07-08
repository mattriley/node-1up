const _ = require('lodash');

module.exports = config => {

    const { cities, states, countries } = config.locationData;

    const lookupPlan = {
        country: [countries, 'name', 'isoCode'],
        state: [states, 'name', 'isoCode'],
        city: [cities, 'name', 'iataCode'],
        statesByCountry: [states, 'country', 'countryCode']
    };

    const lookup = _.mapValues(lookupPlan, args => {
        const [items, ...keyNames] = args;
        return Object.assign(...keyNames.map(keyName => _.groupBy(items, item => item[keyName]?.toLowerCase())));
    });

    const locationData = { cities, states, countries, lookup };
    return { locationData };

}
