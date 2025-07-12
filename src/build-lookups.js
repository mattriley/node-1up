const { obj } = require('./modules');

module.exports = config => {

    const { cities, states, countries } = config.locationData;

    const lookupPlan = {
        countries: [countries, 'name', 'isoCode'],
        states: [states, 'name', 'isoCode'],
        cities: [cities, 'name'],
        statesByCountry: [states, 'country', 'countryCode']
    };

    const lookup = _.mapValues(lookupPlan, args => {
        const [items, ...keyNames] = args;
        return obj.buildLookup()(items, keyNames);
    });

    lookup.statesByCountryThenState = _.mapValues(
        _.groupBy(states, state => state.countryCode.toUpperCase()),
        groupedStates => _.keyBy(groupedStates, state => state.isoCode.toUpperCase())
    );

    const locationData = { cities, states, countries, lookup };
    return { locationData };

}
