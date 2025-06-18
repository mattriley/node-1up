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

module.exports = () => (location, defaultLocation = {}) => {


    const findCities = (cityKey, cityList = allCities) => {
        let resultCities = [];
        if (typeof (cityKey) === 'function') {
            resultCities = cityList.filter(cityKey);
        } else {
            cityKey = cityKey?.toLowerCase();
            resultCities = lookup.city.byName[cityKey] || [];
        }
        return {
            cities: resultCities.length > 1 ? resultCities : null,
            city: resultCities.length === 1 ? resultCities[0] : null
        };
    }


    const findStates = (stateKey, stateList = allStates) => {
        let resultStates = [];
        if (typeof (stateKey) === 'function') {
            resultStates = stateList.filter(stateKey);
        } else {
            stateKey = stateKey?.toLowerCase();
            resultStates = lookup.state.byName[stateKey] || lookup.state.byIso[stateKey] || [];
        }
        return {
            states: resultStates.length > 1 ? resultStates : null,
            state: resultStates.length === 1 ? resultStates[0] : null
        };
    };



    const findCountries = countryKey => {
        countryKey = countryKey?.toLowerCase();
        const resultCountries = lookup.country.byName[countryKey] || lookup.country.byIso[countryKey] || [];
        return {
            countries: resultCountries.length > 1 ? resultCountries : null,
            country: resultCountries.length === 1 ? resultCountries[0] : null
        };
    }

    let cityKey = location.city?.trim().toLowerCase();
    let stateKey = location.state?.trim().toLowerCase();
    let countryKey = location.country?.trim().toLowerCase();
    let defaultCountryKey = defaultLocation.country?.trim().toLowerCase();

    const { country: defaultCountry } = findCountries(defaultCountryKey);
    if (defaultCountryKey && !defaultCountry) return {
        errors: [`Default country not found: ${defaultLocation.country}`]
    }


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


    if (cityKey) {
        const { city, cities } = findCities(cityKey);
        if (city) {
            const { state } = findStates(city.stateCode);
            const { country } = findCountries(city.countryCode);
            return result(city, state, country, ['city']);
        }

        // CITY IS AMBIGUOUS
        if (cities) {
            if (stateKey) {
                const { state, states } = findStates(stateKey);
                console.warn(state);
                if (state) {
                    const { city } = findCities(city => city.stateCode === state.isoCode, cities);
                    if (city) {
                        const { country } = findCountries(city.countryCode);
                        return result(city, state, country, ['city', 'state']);
                    }
                }
                // console.warn(lookup.state.byIso);

                // STATE IS AMBIGUOUS
                if (states) {
                    // const state = states.find(state => cities.find(city => city.stateCode === state.isoCode));
                    // // state = states.filter(state => cities.find(city => city.stateCode === state.isoCode));
                    // if (state) {
                    //     const { country } = findCountries(state.countryCode);
                    //     return result(city, state, country, ['city', 'state']);
                    // }
                    if (countryKey) {
                        // console.warn('**');
                        const { country } = findCountries(countryKey);
                        // console.warn(states);
                        const { state } = findStates(state => state.countryCode === country.isoCode, states);
                        console.warn(state);
                        const { city } = findCities(city => city.stateCode === state.isoCode, cities);
                        // console.warn({ city, state, country });
                        return result(city, state, country, ['city', 'state', 'country']);
                    }
                    return { errors: [`City and state combination cannot be uniquely identified: ${location.city}, ${location.state}`] }
                }
                // return { errors: [`City and state combination cannot be uniquely identified: ${location.city}, ${location.state}`] }
            }
            if (countryKey) {
                const { country } = findCountries(countryKey);
                const { city } = findCities(city => city.countryCode === country.isoCode, cities);
                if (city) {
                    const { state, states } = findStates(city.stateCode);
                    if (state) {
                        return result(city, state, country, ['city', 'country']);
                    }
                    if (states) {
                        const { state } = findStates(state => state.countryCode === country.isoCode, states);
                        return result(city, state, country, ['city', 'country']);
                    }
                }
                return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
            }
            return { errors: [`City cannot be uniquely identified: ${location.city}`] }
        }
    }

    if (stateKey) {
        const { state, states } = findStates(stateKey);
        if (state) {
            const { country } = findCountries(state.countryCode);
            return result(null, state, country, ['state'])
        }
        if (states) {
            if (countryKey) {
                const { country } = findCountries(countryKey);
                const { state } = findStates(state => state.countryCode === country.isoCode, states);
                if (state) {
                    return result(null, state, country, ['state', 'country']);
                }
            }
        }
    }

    if (countryKey) {
        const { country } = findCountries(countryKey);
        if (country) {
            return result(null, null, country, ['country']);
        }
    }














    // // CITY

    // findCities(cityKey);

    // if (cityData) {
    //     findStates(cityData.stateCode);

    //     findCountries(cityData.countryCode);
    //     // if (cityData && stateData && countryData && unique.length === 0) {
    //     //     unique = ['city'];
    //     // }
    // }

    // // CITY+STATE

    // findStates(stateKey);

    // if (stateData && cities.length > 1) {
    //     findCities(city => city.stateCode === stateData.isoCode);
    //     console.warn({ cityData, stateData })
    //     if (cityData && stateData) {
    //         unique = ['city', 'state'];
    //     }
    // }




    // findCountries(countryKey);

    // const defaultCountries = defaultCountryKey ? lookup.country.byName[defaultCountryKey] || lookup.country.byIso[defaultCountryKey] || [] : [];
    // const defaultCountryData = defaultCountries[0];
    // if (defaultCountryKey && !defaultCountryData) {
    //     return { errors: [`Default country not found: ${defaultLocation.country}`] }
    // }




    // if (cities.length > 1) {

    //     if (countryKey) {
    //         findCountries(countryKey);
    //         findCities(city => city.countryCode === countryData.isoCode);
    //         if (cityData) {
    //             findStates(cityData.stateCode);
    //         }
    //     }

    //     if (!cityData && defaultCountryKey) {
    //         findCities(city => city.countryCode === defaultCountryData.isoCode);
    //         if (cityData) {

    //             findCountries(defaultCountryKey);
    //             findStates(cityData.stateCode);
    //         }
    //     }

    //     // if (cityData && stateData && !countryData && unique.length === 0) {
    //     //     unique.push('city');
    //     //     unique.push('country');
    //     // }

    //     if (!cityData && cityKey && !stateKey && !countryKey) {
    //         return { errors: [`City cannot be uniquely identified: ${city}`] }
    //     }
    // }









    // if (stateKey) {



    //     if (states.length === 1) {
    //         stateData = states[0];



    //         findCountries(stateData.countryCode);
    //     }

    //     if (states.length > 1) {
    //         if (countryData) {
    //             findStates(state => state.countryCode === countryData.isoCode);
    //         }


    //         if (defaultCountryKey) {
    //             stateData = states.find(state => state.countryCode === defaultCountryData.isoCode);
    //             if (stateData) findCountries(defaultCountryData.isoCode);
    //         }

    //         if (!cityData && cityKey && !stateData && stateKey && !countryKey) {
    //             return { errors: [`City and state combination cannot be uniquely identified: ${city}, ${state}`] }
    //         }

    //     }
    // }




    // if (countryData) {
    //     findCities(city => city.countryCode === countryData.isoCode);
    //     findStates(state => state.countryCode === countryData.isoCode);
    // }

    // if (stateData) {
    //     findCities(city => city.stateCode === stateData.isoCode);
    // }

    // if (cityData) {
    //     if (!stateData) {
    //         findStates(cityData.stateCode);
    //     }
    // }

    // if (cityKey && !cityData && countryKey) {
    //     return { errors: [`City and country combination cannot be uniquely identified: ${city}, ${country}`] }
    // }


    // return {
    //     city: cityData?.name,
    //     state: stateData?.name,
    //     'state.iso': stateData?.isoCode,
    //     country: countryData?.name,
    //     'country.iso2': countryData?.isoCode,
    //     unique
    // }



}
