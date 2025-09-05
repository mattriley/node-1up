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




    // ─── Helpers ───────────────────────────────────────────────────────────────────
    const norm = s => s?.trim().toUpperCase(); // " Victoria " → "victoria", "US" → "us"

    // states assumed shape: { isoCode, name, countryCode, countryName }
    const groupedByCountry = _.groupBy(states, st => norm(st.countryCode));

    lookup.statesByCountryThenState = {};

    for (const [countryKey, countryStates] of Object.entries(groupedByCountry)) {
        const stateMap = {};

        for (const st of countryStates) {
            if (st.isoCode) stateMap[norm(st.isoCode)] = st;
            if (st.name) stateMap[norm(st.name)] = st;
        }

        const countryISO = norm(countryStates[0].countryCode);

        const countryName = lookup.countries[countryKey][0].name.toUpperCase();

        if (countryISO) lookup.statesByCountryThenState[countryISO] = stateMap;
        if (countryName) lookup.statesByCountryThenState[countryName] = stateMap;
    }




    lookup.citiesByStateThenCountry = {};

    for (const [_, cityList] of Object.entries(lookup.cities)) {
        for (const city of cityList) {
            if (!city.stateCode) continue;
            const stateCode = city.stateCode.toUpperCase();
            const countryCode = city.countryCode.toUpperCase();
            const key = `${stateCode}::${countryCode}`;

            if (!lookup.citiesByStateThenCountry[key]) {
                lookup.citiesByStateThenCountry[key] = [];
            }

            lookup.citiesByStateThenCountry[key].push(city);
        }
    }


    const locationData = { cities, states, countries, lookup };




    return { locationData };

};
