module.exports = ({ arr, config }) => {

    const { locationData } = config;
    const { lookup } = locationData;

    const findCities = (cityKey, container) => {
        const cities = lookup.cities[cityKey?.toLowerCase()] ?? [];
        return arr.poly(cities, container);
    }

    const findStates = (stateKey, container) => {
        const states = lookup.states[stateKey?.toLowerCase()] ?? [];
        return arr.poly(states, container);
    }

    const findState = (stateKey, countryKey) => {
        const states = lookup.states[stateKey.toLowerCase()] ?? [];
        const state = states.find(state => state.countryCode.toLowerCase() === countryKey.toLowerCase());
        if (!state) throw new Error(`State not found: ${stateKey}; Country: ${countryKey}`);
        return state;
    };

    const findCountries = (countryKey, container) => {
        const countries = lookup.countries[countryKey?.toLowerCase()] ?? [];
        return arr.poly(countries, container);
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

    return { findCities, findState, findStates, findCountries, findCountry, findStatesOfCountry };

};
