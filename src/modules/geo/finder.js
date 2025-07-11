module.exports = ({ config }) => {

    const { locationData } = config;
    const { lookup } = locationData;

    const findCity = (cityKey, stateKey, countryKey) => {
        const cities = lookup.cities[cityKey.toUpperCase()] ?? [];
        const city = cities.find(city => {
            return city.stateKey.toUpperCase() === stateKey.toUpperCase() &&
                city.countryKey.toUpperCase() === countryKey.toUpperCase();
        });
        if (!city) throw new Error(`City not found: ${cityKey}; State: ${stateKey}; Country: ${countryKey}`);
        return city;
    };

    const findCities = (cityKey) => {
        return lookup.cities[cityKey.toUpperCase()] ?? [];
    }

    const findStates = (stateKey) => {
        return lookup.states[stateKey.toUpperCase()] ?? [];
    }

    const findState = (stateKey, countryKey) => {
        const state = lookup.statesByCountryThenState[countryKey.toUpperCase()][stateKey.toUpperCase()];
        if (!state) throw new Error(`State not found: ${stateKey}; Country: ${countryKey}`);
        return state;
    };

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
        return lookup.statesByCountry[countryKey.toUpperCase()];
    }

    return { findCity, findCities, findState, findStates, findCountries, findCountry, findStatesOfCountry };

};
