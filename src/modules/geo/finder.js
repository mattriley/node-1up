module.exports = ({ config }) => {

    const { locationData } = config;
    const { lookup } = locationData;

    // City not found: Kobe; State: 28; Country: JP
    const findCity = (cityKey, stateKey, countryKey) => {
        const cities = lookup.cities[cityKey.toUpperCase()] ?? [];

        const state = stateKey && findState(stateKey, countryKey);
        const country = findCountry(countryKey);

        const city = cities.find(city => {
            const countryMatch = city.countryCode.toUpperCase() === country.isoCode.toUpperCase();
            if (!state) return countryMatch;
            const stateMatch1 = city.stateCode && city.stateCode.toUpperCase() === state.isoCode.toUpperCase();
            const stateMatch2 = city.state && city.state.toUpperCase() === state.name.toUpperCase();
            return (stateMatch1 || stateMatch2) && countryMatch;
        });

        if (!city) throw new Error(`City not found: ${cityKey}; State: ${stateKey}; Country: ${countryKey}`);
        return city;
    };

    const findCitiesOfState = (stateKey, countryKey) => {
        const key = `${stateKey.toUpperCase()}::${countryKey.toUpperCase()}`;
        return lookup.citiesByStateThenCountry[key] ?? [];
    };

    const findCities = (cityKey) => {
        return lookup.cities[cityKey.toUpperCase()] ?? [];
    }

    const findStates = (stateKey) => {
        return lookup.states[stateKey.toUpperCase()] ?? [];
    }

    const norm = s => s?.trim().toUpperCase();

    const findState = (stateKey, countryKey) => {
        const country = findCountry(countryKey);

        const countryStates = lookup.statesByCountryThenState[norm(countryKey)];
        // if (!countryStates) throw new Error(`No states found for country: ${countryKey}`);
        // not all countries have states.

        if (!countryStates) return null;

        // const state = countryStates[norm(stateKey)];

        const states = lookup.states[stateKey.toUpperCase()] ?? [];
        const state = states.find(state => state.countryCode === country.isoCode);

        if (!state) throw new Error(`State not found: ${stateKey}; Country: ${countryKey}`);

        return state;
    };

    // const findState = (stateKey, countryKey) => {
    //     const country = findCountry(countryKey);

    //     const countryStates = lookup.statesByCountryThenState[norm(countryKey)];
    //     if (!countryStates) throw new Error(`No states found for country: ${countryKey}`);

    //     // const state = countryStates[norm(stateKey)];

    //     const states = lookup.states[stateKey.toUpperCase()] ?? [];
    //     const state = states.find(state => state.countryCode === country.isoCode);

    //     if (!state) throw new Error(`State not found: ${stateKey}; Country: ${countryKey}`);

    //     return state;
    // };


    const findCountries = (countryKey) => {
        return lookup.countries[countryKey.toUpperCase()] ?? [];
    }

    const findCountry = countryKey => {
        const countries = lookup.countries[countryKey.toUpperCase()] ?? [];
        const country = countries[0];
        if (!country) throw new Error(`Country not found: ${countryKey}`);
        return country;
    };

    const findStatesOfCountry = countryKey => {
        return lookup.statesByCountry[countryKey.toUpperCase()]
    }

    return { findCity, findCities, findState, findStates, findCountries, findCountry, findStatesOfCountry, findCitiesOfState };

};
