module.exports = config => {

    const { cities, states, countries } = config.locationData;

    const lookupPlan = {
        countries: [countries, 'name', 'isoCode'],
        states: [states, 'name', 'isoCode'],
        cities: [cities, 'name', 'iataCode'],
        statesByCountry: [states, 'country', 'countryCode']
    };

    const lookup = _.mapValues(lookupPlan, args => {
        const [items, ...keyNames] = args;
        return Object.assign(...keyNames.map(keyName => {
            return _.groupBy(items, item => {
                if (!item[keyName]?.toLowerCase) return 'ERROR';
                return item[keyName]?.toLowerCase()
            })
        }));
    });

    lookup.statesByCountryThenState = _.mapValues(
        _.groupBy(states, state => state.countryCode.toLowerCase()),
        groupedStates => _.keyBy(groupedStates, state => state.isoCode.toLowerCase())
    );

    const locationData = { cities, states, countries, lookup };
    return { locationData };

}
