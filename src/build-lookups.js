module.exports = config => {

    const { cities, states, countries } = config.locationData;

    const iataCities = cities.filter(city => Array.isArray(city.iataCodes) && city.iataCodes.length > 0);

    const lookupPlan = {
        countries: [countries, 'name', 'isoCode'],
        states: [states, 'name', 'isoCode'],
        cities: [cities, 'name', 'iataCode'],
        statesByCountry: [states, 'country', 'countryCode']
    };

    const lookup = _.mapValues(lookupPlan, args => {
        const [items, ...keyNames] = args;
        return Object.assign(...keyNames.map(keyName => _.groupBy(items, item => item[keyName]?.toLowerCase())));
    });

    const locationData = { iataCities, cities, states, countries, lookup };
    return { locationData };

}
