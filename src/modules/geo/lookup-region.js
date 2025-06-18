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



    const findCities = cityKey => {
        if (typeof (cityKey) === 'function') {
            cities = cities.filter(cityKey);
        } else {
            cityKey = cityKey?.toLowerCase();
            cities = lookup.city.byName[cityKey] || [];
        }
        if (cities.length === 1) cityData = cities[0];
        return { cities, city: cityData };
    }


    const findStates = state => {
        if (typeof (state) === 'function') {
            states = states.filter(state);
        } else {
            state = state?.toLowerCase();
            states = lookup.state.byName[state] || lookup.state.byIso[state] || [];
        }
        if (states.length === 1) stateData = states[0];
        return { states, state: stateData };
    };



    const findCountries = country => {
        country = country?.toLowerCase();
        countries = lookup.country.byName[country] || lookup.country.byIso[country] || [];
        if (countries.length === 1) countryData = countries[0];
        return { countries, country: countryData };
    }

    let unique = [];


    let cities;
    let states;
    let countries;

    const result = (cityData, stateData, countryData, unique) => {
        return {
            city: cityData?.name,
            state: stateData?.name,
            'state.iso': stateData?.isoCode,
            country: countryData?.name,
            'country.iso2': countryData?.isoCode,
            unique
        }
    }




    // CITY

    {
        const { cities, city } = findCities(cityKey);

        if (city) {
            const { state } = findStates(city.stateCode);
            const { country } = findCountries(city.countryCode);
            return result(city, state, country, ['city']);
        }

    }












    // CITY

    findCities(cityKey);

    if (cityData) {
        findStates(cityData.stateCode);

        findCountries(cityData.countryCode);
        // if (cityData && stateData && countryData && unique.length === 0) {
        //     unique = ['city'];
        // }
    }

    // CITY+STATE

    findStates(stateKey);

    if (stateData && cities.length > 1) {
        findCities(city => city.stateCode === stateData.isoCode);
        console.warn({ cityData, stateData })
        if (cityData && stateData) {
            unique = ['city', 'state'];
        }
    }




    findCountries(countryKey);

    const defaultCountries = defaultCountryKey ? lookup.country.byName[defaultCountryKey] || lookup.country.byIso[defaultCountryKey] || [] : [];
    const defaultCountryData = defaultCountries[0];
    if (defaultCountryKey && !defaultCountryData) {
        return { errors: [`Default country not found: ${defaultLocation.country}`] }
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

        // if (cityData && stateData && !countryData && unique.length === 0) {
        //     unique.push('city');
        //     unique.push('country');
        // }

        if (!cityData && cityKey && !stateKey && !countryKey) {
            return { errors: [`City cannot be uniquely identified: ${city}`] }
        }
    }









    if (stateKey) {



        if (states.length === 1) {
            stateData = states[0];



            findCountries(stateData.countryCode);
        }

        if (states.length > 1) {
            if (countryData) {
                findStates(state => state.countryCode === countryData.isoCode);
            }


            if (defaultCountryKey) {
                stateData = states.find(state => state.countryCode === defaultCountryData.isoCode);
                if (stateData) findCountries(defaultCountryData.isoCode);
            }

            if (!cityData && cityKey && !stateData && stateKey && !countryKey) {
                return { errors: [`City and state combination cannot be uniquely identified: ${city}, ${state}`] }
            }

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

    if (cityKey && !cityData && countryKey) {
        return { errors: [`City and country combination cannot be uniquely identified: ${city}, ${country}`] }
    }


    return {
        city: cityData?.name,
        state: stateData?.name,
        'state.iso': stateData?.isoCode,
        country: countryData?.name,
        'country.iso2': countryData?.isoCode,
        unique
    }



}
