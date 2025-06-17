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


module.exports = () => ({ city, state, country }) => {
    let cityKey = city?.trim().toLowerCase();
    let stateKey = state?.trim().toLowerCase();
    let countryKey = country?.trim().toLowerCase();

    let cityData;
    let stateData;
    let countryData;

    const cities = lookup.city.byName[cityKey] || [];

    if (cityKey) {


        if (cities.length === 0) {
            console.warn(`City not found: ${city}`);
        }

        if (cities.length === 1) {
            cityData = cities[0];
            stateData = lookup.state.byIso[cityData.stateCode.toLowerCase()].find(state => state.countryCode === cityData.countryCode);
            countryData = lookup.country.byIso[cityData.countryCode.toLowerCase()][0];
        }
    }

    const states = lookup.state.byName[stateKey] || lookup.state.byIso[stateKey] || [];


    if (stateKey) {

        if (states.length === 0) {
            console.warn(`State not found: ${state}`);
        }

        if (states.length === 1) {
            stateData = states[0];
            countryData = lookup.country.byIso[stateData.countryCode.toLowerCase()][0];
        }
    }

    if (stateData) {
        cityData ??= cities.find(city => city.stateCode === stateData.isoCode);
    }

    if (countryKey) {
        const countries = lookup.country.byName[countryKey] || lookup.country.byIso[countryKey] || [];

        if (countries.length === 0) {
            console.warn(`County not found: ${state}`);
        }

        if (countries.length === 1) {
            countryData = countries[0];
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
