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
    const norm = s => s.trim().toUpperCase();      // “ Victoria ” → "victoria"
    const iso = s => s.trim().toUpperCase();      //  "us"       → "US"

    // states -- assumed shape: { isoCode, name, countryCode, countryName }
    const groupedByCountry = _.groupBy(states, st => iso(st.countryCode));

    lookup.statesByCountryThenState = {};

    for (const [countryISO, countryStates] of Object.entries(groupedByCountry)) {
        // Build the per-country state map once
        const stateMap = {};
        for (const st of countryStates) {
            stateMap[iso(st.isoCode)] = st;   // "CA"
            stateMap[norm(st.name)] = st;   // "california"
        }

        // Get a country name we can safely normalise
        const countryName =
            countryStates[0].countryName || lookup.countries[countryISO]?.name;

        // Expose the SAME stateMap under both keys
        lookup.statesByCountryThenState[iso(countryISO)] = stateMap;   // "US"
        if (countryName) {
            lookup.statesByCountryThenState[norm(countryName)] = stateMap; // "united states"
        }
    }


    lookup.citiesByStateThenCountry = {};

    for (const [cityKey, cityList] of Object.entries(lookup.cities)) {
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

}
