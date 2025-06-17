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
const lookupState = state => lookup.state.byName[state] || lookup.state.byIso[state] || [];
const lookupCountry = country => lookup.country.byName[country] || lookup.country.byIso[country] || [];


module.exports = () => ({ city, state, country }) => {
    let cityKey = city?.trim().toLowerCase();
    let stateKey = state?.trim().toLowerCase();
    let countryKey = country?.trim().toLowerCase();

    let cityData;
    let stateData;
    let countryData;

    const cities = lookupCity(cityKey);
    const states = lookupState(stateKey);
    const countries = lookupCountry(countryKey);

    if (cityKey) {


        if (cities.length === 0) {
            console.warn(`City not found: ${city}`);
        }

        if (cities.length === 1) {
            cityData = cities[0];
            stateData = lookupState(cityData.stateCode.toLowerCase()).find(state => state.countryCode === cityData.countryCode);
            countryData = lookupCountry(cityData.countryCode.toLowerCase())[0];
        }
    }



    if (stateKey) {

        if (states.length === 0) {
            console.warn(`State not found: ${state}`);
        }

        if (states.length === 1) {
            stateData = states[0];
            countryData = lookupCountry(stateData.countryCode.toLowerCase())[0];
        }
    }



    if (countryKey) {

        if (countries.length === 0) {
            console.warn(`County not found: ${state}`);
        }

        if (countries.length === 1) {
            countryData = countries[0];
        }
    }

    if (stateData) {
        cityData ??= cities.find(city => city.stateCode === stateData.isoCode);
    }

    if (countryData) {
        cityData ??= cities.find(city => city.countryCode === countryData.isoCode);
        stateData ??= states.find(state => state.countryCode === countryData.isoCode);

        if (cityData) {
            stateData ??= lookupState(cityData.stateCode.toLowerCase())[0];
        }
    }

    return {
        city: cityData?.name,
        state: stateData?.name,
        'state.iso': stateData?.isoCode,
        country: countryData?.name,
        'country.iso2': countryData?.isoCode
    }



}
