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

    const findCountries = (countryKey, container) => {
        const countries = lookup.countries[countryKey?.toLowerCase()] ?? [];
        return arr.poly(countries, container);
    }

    const findStatesOfCountry = countryKey => {
        return lookup.statesByCountry[countryKey.toLowerCase()];
    }

    return { findCities, findStates, findCountries, findStatesOfCountry };

};
