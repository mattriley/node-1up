module.exports = ({ config }) => {

    const { locationData } = config;
    const { lookup } = locationData;

    const findCity = (cityKey, stateKey, countryKey) => {
        const cities = lookup.cities[cityKey.toLowerCase()] ?? [];
        const city = cities.find(city => {
            return city.stateKey.toLowerCase() === stateKey.toLowerCase() &&
                city.countryKey.toLowerCase() === countryKey.toLowerCase();
        });
        if (!city) throw new Error(`City not found: ${cityKey}; State: ${stateKey}; Country: ${countryKey}`);
        return city;
    };

    const findCities = (cityKey) => {
        return lookup.cities[cityKey.toLowerCase()] ?? [];
    }

    const findStates = (stateKey) => {
        return lookup.states[stateKey.toLowerCase()] ?? [];
    }

    const findState = (stateKey, countryKey) => {
        const state = lookup.statesByCountryThenState[countryKey.toLowerCase()][stateKey.toLowerCase()];
        if (!state) throw new Error(`State not found: ${stateKey}; Country: ${countryKey}`);
        return state;
    };

    const findCountries = (countryKey) => {
        return lookup.countries[countryKey.toLowerCase()] ?? [];
    }

    const findCountry = countryKey => {
        const countries = lookup.countries[countryKey.toLowerCase()] ?? [];
        const country = countries[0];
        if (!country) throw new Error(`Country not found: ${countryKey}`);
        return country;
    };

    const findStatesOfCountry = countryKey => {
        return lookup.statesByCountry[countryKey.toLowerCase()];
    }

    return { findCity, findCities, findState, findStates, findCountries, findCountry, findStatesOfCountry };

};
