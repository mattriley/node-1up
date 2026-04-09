module.exports = ({ config }) => {

    const { locationData } = config;
    const { lookup } = locationData;
    const norm = s => s?.trim().toUpperCase();

    const findLookupValues = (table, supplementaryTable, key) => {
        const normalizedKey = norm(key);
        if (!normalizedKey) return [];
        return table[normalizedKey] ?? supplementaryTable?.[normalizedKey] ?? [];
    };

    const findCity = (cityKey, stateKey, countryKey) => {
        const cities = findCities(cityKey);

        const state = stateKey && findState(stateKey, countryKey);
        const country = findCountry(countryKey);

        const city = cities.find(city => {
            const countryMatch = country && city.countryCode.toUpperCase() === country.isoCode.toUpperCase();
            if (!state) return countryMatch;
            const stateMatch1 = city.stateCode && city.stateCode.toUpperCase() === state.isoCode.toUpperCase();
            const stateMatch2 = city.state && city.state.toUpperCase() === state.name.toUpperCase();
            return (stateMatch1 || stateMatch2) && countryMatch;
        });

        if (!city) throw new Error(`City not found: ${cityKey}; State: ${stateKey}; Country: ${countryKey}`);
        return city;
    };

    const findCitiesOfState = (stateKey, countryKey) => {
        const state = findState(stateKey, countryKey);
        const country = findCountry(countryKey);
        if (!state || !country) return [];
        const key = `${state.isoCode.toUpperCase()}::${country.isoCode.toUpperCase()}`;
        return lookup.citiesByStateThenCountry[key] ?? [];
    };

    const findCities = cityKey => {
        return findLookupValues(lookup.cities, lookup.supplementary?.cities, cityKey);
    };

    const findStates = stateKey => {
        return findLookupValues(lookup.states, lookup.supplementary?.states, stateKey);
    };

    const findState = (stateKey, countryKey) => {
        const country = findCountry(countryKey);
        const countryStates = lookup.statesByCountryThenState[norm(country.isoCode)]
            ?? lookup.statesByCountryThenState[norm(country.name)];
        // if (!countryStates) throw new Error(`No states found for country: ${countryKey}`);
        // not all countries have states.

        if (!countryStates) return null;

        const states = findStates(stateKey);
        const state = states.find(state => state.countryCode === country.isoCode);

        if (!state) throw new Error(`State not found: ${stateKey}; Country: ${countryKey}`);

        return state;
    };

    const findCountries = countryKey => {
        return findLookupValues(lookup.countries, lookup.supplementary?.countries, countryKey);
    };

    const findCountry = countryKey => {
        if (!countryKey) return null;
        const countries = findCountries(countryKey);
        const country = countries[0];
        if (!country) throw new Error(`Country not found: ${countryKey}`);
        return country;
    };

    const findStatesOfCountry = countryKey => {
        return lookup.statesByCountry[countryKey.toUpperCase()];
    };

    return { findCity, findCities, findState, findStates, findCountries, findCountry, findStatesOfCountry, findCitiesOfState };

};
