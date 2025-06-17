const _ = require('lodash');
const { Country, State, City } = require('country-state-city');

const allCountries = Country.getAllCountries();
const allStates = State.getAllStates();
const allCities = City.getAllCities();

const hk = allStates.find(s => s.name === 'Hong Kong SAR');
allStates.push({ ...hk, name: 'Hong Kong' });

const mo = allStates.find(s => s.name === 'Macau SAR');
allStates.push({ ...mo, name: 'Macau' });

const lookup = {
    country: {
        byIso: _.groupBy(allCountries, country => country.isoCode.toLowerCase()),
        byName: _.groupBy(allCountries, country => country.name.toLowerCase())
    },
    state: {
        byIso: _.groupBy(allStates, state => state.isoCode.toLowerCase()),
        byName: _.groupBy(allStates, state => state.name.toLowerCase())
    },
    city: {
        byName: _.groupBy(allCities, city => city.name.toLowerCase())
    }
};

const findCities = city => {
    city = city?.toLowerCase();
    return lookup.city.byName[city] || [];
}

const findStates = state => {
    state = state?.toLowerCase();
    return lookup.state.byName[state] || lookup.state.byIso[state] || [];
};

const findCountries = country => {
    country = country?.toLowerCase();
    return lookup.country.byName[country] || lookup.country.byIso[country] || [];
}

const exactState = (state, country) => {
    const states = findStates(state, country);
    if (states.length === 1) return states[0];
}



const exactCountry = (country) => {
    const countries = findCountries(country.toLowerCase());
    if (countries.length === 1) return countries[0];
}

const normalise = obj => _.mapValues(obj, val => val?.trim().toLowerCase());

module.exports = () => (location, defaultLocation = {}) => {
    const { city, state, country } = normalise(location);
    const { country: defaultCountry } = normalise(defaultLocation);

    let cityData;
    let stateData;
    let countryData;
    const defaultCountryData = defaultCountry ? exactCountry(defaultCountry) : null;


    const renderResult = () => {
        return {
            city: cityData?.name,
            state: stateData?.name,
            'state.iso': stateData?.isoCode,
            country: countryData?.name,
            'country.iso2': countryData?.isoCode
        }
    }


    let cities = findCities(city);
    let states = findStates(state);
    let countries = findCountries(country);

    if (city && cities.length === 0) {
        console.warn(`City not found: ${city}`);
        return renderResult()
    }

    if (cities.length === 1) {
        cityData = cities[0];
        states = findStates(cityData.stateCode);
        countries = findCountries(cityData.countryCode);
    }


    if (states.length === 0) {
        console.warn(`State not found: ${state}`);
    }

    if (states.length === 1) {
        stateData = states[0];
        countries = findCountries(stateData.countryCode);
    }

    if (states.length > 1) {
        if (defaultCountry) {
            countryData = exactCountry(defaultCountry);
            stateData = states.find(state => state.countryCode === countryData.isoCode);
        }
    }


    if (countries.length === 1) {
        countryData ??= countries[0];
    }



    if (countries.length === 0) {
        console.warn(`County not found: ${state}`);
    }

    if (countries.length === 1) {
        countryData = countries[0];
    }

    if (countries.length > 1) {
        console.warn(`Non-unique country: ${country}. This should never happen.`);
    }



    if (cities.length > 1 && countryData) {
        cities = cities.filter(city => city.countryCode === countryData.isoCode);
    }

    if (cities.length > 1 && defaultCountryData) {
        cities = cities.filter(city => city.countryCode === defaultCountryData.isoCode);
    }

    if (cities.length === 1) {
        cityData = cities[0];
    }

    if (cities.length === 1) {
        countries = findCountries(cityData.countryCode);
    }

    if (countries.length === 1) {
        countryData = countries[0];
    }


    cityData ??= cities.find(city => city.countryCode === countryData.isoCode);
    stateData ??= states.find(state => state.countryCode === countryData.isoCode);

    if (stateData) {
        cityData ??= cities.find(city => city.stateCode === stateData.isoCode);
    }

    if (cityData) {
        stateData ??= exactState(cityData.stateCode);
    }

    return renderResult();

}
