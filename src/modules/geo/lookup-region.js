const _ = require('lodash');
const { Country, State, City } = require('country-state-city');

const allCountries = Country.getAllCountries();
const allStates = State.getAllStates();
const allCities = City.getAllCities();

const hk = allStates.find(s => s.name === 'Hong Kong SAR');
hk.name = 'Hong Kong';

const mo = allStates.find(s => s.name === 'Macau SAR');
mo.name = 'Macau';

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



module.exports = () => ({ city, state, country }, defaultLocation = {}) => {
    let cityKey = city?.trim().toLowerCase();
    let stateKey = state?.trim().toLowerCase();
    let countryKey = country?.trim().toLowerCase();
    let defaultCountryKey = defaultLocation.country?.trim().toLowerCase();

    let cityData;
    let stateData;
    let countryData;



    const findCities = city => {
        if (typeof (city) === 'function') {
            cities = cities.filter(city);
        } else {
            city = city?.toLowerCase();
            cities = lookup.city.byName[city] || [];
        }
        if (cities.length === 1) cityData = cities[0];
    }

    const findStates = state => {
        if (typeof (state) === 'function') {
            states = states.filter(state);
        } else {
            state = state?.toLowerCase();
            states = lookup.state.byName[state] || lookup.state.byIso[state] || [];
        }
        if (states.length === 1) stateData = states[0];
        return states;
    };



    const findCountries = country => {
        country = country?.toLowerCase();
        countries = lookup.country.byName[country] || lookup.country.byIso[country] || [];
        if (countries.length === 1) countryData = countries[0];
    }



    let cities;
    findCities(cityKey);

    let states;
    findStates(stateKey);

    let countries;
    findCountries(countryKey);

    const defaultCountries = defaultCountryKey ? lookup.country.byName[defaultCountryKey] || lookup.country.byIso[defaultCountryKey] || [] : [];
    const defaultCountryData = defaultCountries[0];
    if (defaultCountryKey && !defaultCountryData) {
        return { errors: [`Default country not found: ${defaultLocation.country}`] }
    }

    if (cityData) {
        findStates(cityData.stateCode);
        findCountries(cityData.countryCode);
    }

    if (cities.length > 1) {

        if (countryKey) {
            findCountries(countryKey);
            findCities(city => city.countryCode === countryData.isoCode);
            if (cityData) {
                findStates(cityData.stateCode);
            }
        }

        if (!cityData && defaultCountryKey) {
            findCities(city => city.countryCode === defaultCountryData.isoCode);
            if (cityData) {
                findCountries(defaultCountryKey);
                findStates(cityData.stateCode);
            }
        }

        if (!cityData && cityKey && !stateKey && !countryKey) {
            return { errors: [`City cannot be uniquely identified: ${city}`] }
        }
    }







    if (stateKey) {

        console.warn(states)

        if (states.length === 0) {
            console.warn(`State not found: ${state}`);
        }

        if (states.length === 1) {
            stateData = states[0];
            findCountries(stateData.countryCode);
        }

        if (states.length > 1) {
            if (countryData) {
                findStates(state => state.countryCode === countryData.isoCode);
            }

            console.warn({ stateData, countryData })

            if (defaultCountryKey) {
                stateData = states.find(state => state.countryCode === defaultCountryData.isoCode);
                if (stateData) findCountries(defaultCountryData.isoCode);
            }

            if (!cityData && cityKey && !stateData && stateKey && !countryKey) {
                return { errors: [`City and state cannot be uniquely identified: ${city}, ${state}`] }
            }

        }
    }



    if (countryKey) {

        if (countries.length > 1) {
            console.warn(`Non-unique country: ${country}. This should never happen.`);
        }
    }


    if (countryData) {
        findCities(city => city.countryCode === countryData.isoCode);
        findStates(state => state.countryCode === countryData.isoCode);
    }

    if (stateData) {
        findCities(city => city.stateCode === stateData.isoCode);
    }

    if (cityData) {
        if (!stateData) {
            findStates(cityData.stateCode);
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
