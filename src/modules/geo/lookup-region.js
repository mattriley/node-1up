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

const lookupCity = city => lookup.city.byName[city] || [];

const lookupState = (state, country) => {
    state = state?.toLowerCase();
    country = country?.toLowerCase();
    const states = lookup.state.byName[state] || lookup.state.byIso[state] || [];
    if (!country) return states;
    const countryData = lookupCountry(country)[0];
    return states.filter(state => state.countryCode === countryData.isoCode);
};

const exactState = (state, country) => {
    const states = lookupState(state, country);
    if (states.length === 1) return states[0];
}

const lookupCountry = country => lookup.country.byName[country] || lookup.country.byIso[country] || [];

const exactCountry = (country) => {
    const countries = lookupCountry(country.toLowerCase());
    if (countries.length === 1) return countries[0];
}



module.exports = () => ({ city, state, country }, defaultLocation = {}) => {
    let cityKey = city?.trim().toLowerCase();
    let stateKey = state?.trim().toLowerCase();
    let countryKey = country?.trim().toLowerCase();
    let defaultCountryKey = defaultLocation.country?.trim().toLowerCase();

    let cityData;
    let stateData;
    let countryData;

    const cities = lookupCity(cityKey);
    const states = lookupState(stateKey);
    const countries = lookupCountry(countryKey);

    const inferred = new Set();

    if (cityKey) {

        if (cities.length === 0) {
            console.warn(`City not found: ${city}`);
        }

        if (cities.length === 1) {
            cityData = cities[0];
            stateData = exactState(cityData.stateCode, cityData.countryCode);
            if (stateData) inferred.add('state');
            countryData = exactCountry(cityData.countryCode);
            if (countryData) inferred.add('country');
        }

        if (cities.length > 1) {
            if (defaultCountryKey) {
                countryData = exactCountry(defaultCountryKey);
                cityData = cities.find(city => city.countryCode === countryData.isoCode);
            }
        }
    }



    if (stateKey) {

        if (states.length === 0) {
            console.warn(`State not found: ${state}`);
        }

        if (states.length === 1) {
            stateData = states[0];
            countryData = exactCountry(stateData.countryCode);
            if (countryData) inferred.add('country');
        }

        if (states.length > 1) {
            if (defaultCountryKey) {
                countryData = exactCountry(defaultCountryKey);
                stateData = states.find(state => state.countryCode === countryData.isoCode);
            }
        }
    }



    if (countryKey) {

        if (countries.length === 0) {
            console.warn(`County not found: ${state}`);
        }

        if (countries.length === 1) {
            countryData = countries[0];
        }

        if (countries.length > 1) {
            console.warn(`Non-unique country: ${country}. This should never happen.`);
        }
    }

    if (countryData) {
        cityData ??= cities.find(city => city.countryCode === countryData.isoCode);
        stateData ??= states.find(state => state.countryCode === countryData.isoCode);
    }

    if (stateData) {
        cityData ??= cities.find(city => city.stateCode === stateData.isoCode);
    }

    if (cityData) {
        stateData ??= exactState(cityData.stateCode);
    }

    return {
        city: cityData?.name,
        state: stateData?.name,
        'state.iso': stateData?.isoCode,
        country: countryData?.name,
        'country.iso2': countryData?.isoCode,
        inferred: [...inferred]
    }



}
