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

module.exports = () => {

    const lookupRegion = (location, defaultLocation = {}) => {


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


                const byCountry = () => {

                    if (countryKey) {
                        const { country } = findCountries(countryKey);

                        if (cityKey) {
                            const { city, cities } = findCities(cityKey);
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
                            if (cities) {

                                const statesOfCountry = allStates.filter(state => state.countryCode === country.isoCode);


                                const cities2 = cities.filter(city => statesOfCountry.filter(state => state.isoCode === city.stateCode).length === 1);

                                if (cities2.length > 1) {
                                    return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
                                }

                                if (cities2.length === 1) {
                                    const city = cities2[0];
                                    const state = statesOfCountry.find(state => state.isoCode === city.stateCode);
                                    return result(city, state, country, ['city', 'country']);
                                }


                            }



                        }




                        return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
                    }

                    if (stateKey) {
                        const { state, states } = findStates(stateKey);
                        // we have states and cities

                        const cities2 = states ? cities?.filter(city => states.filter(state => state.isoCode === city.stateCode).length === 1) : [];
                        const states2 = cities ? states?.filter(state => cities.filter(city => city.stateCode === state.isoCode).length === 1) : [];

                        if (cities2?.length !== 1 && states2?.length !== 1) {
                            return { errors: [`City and state combination cannot be uniquely identified: ${location.city}, ${location.state}`] }
                        }
                    }


                    return { errors: [`City cannot be uniquely identified: ${location.city}`] }
                }


                const byState = () => {
                    if (stateKey) {
                        const { state, states } = findStates(stateKey);
                        if (state) {
                            const { city } = findCities(city => city.stateCode === state.isoCode, cities);
                            if (city) {
                                const { country } = findCountries(city.countryCode);
                                return result(city, state, country, ['city', 'state']);
                            }
                        }



                        // STATE IS AMBIGUOUS
                        if (states) {
                            if (countryKey) {
                                const { country } = findCountries(countryKey);

                                if (country) {
                                    const { state } = findStates(state => state.countryCode === country.isoCode, states);
                                    if (state) {
                                        const { city } = findCities(city => city.stateCode === state.isoCode, cities);

                                        if (city) {
                                            return result(city, state, country, ['city', 'state', 'country']);
                                        }
                                    }
                                }

                                // if (country) {
                                //     const { state } = findStates(state => state.countryCode === country.isoCode, states);
                                //     if (state) {
                                //         const { city } = findCities(city => city.stateCode === state.isoCode, cities);

                                //         if (city) {
                                //             return result(city, state, country, ['city', 'state', 'country']);
                                //         }
                                //     }
                                // }
                            }
                            return { errors: [`City and state combination cannot be uniquely identified: ${location.city}, ${location.state}`] }
                        }
                    }
                }

                const getResult = () => {
                    const countryResult = byCountry();
                    const stateResult = byState();

                    // console.warn({ countryResult, stateResult })

                    if (countryResult && stateResult) {
                        if (!countryResult.errors && stateResult.errors) {
                            const sorted = _.sortBy([countryResult, stateResult], res => res.unique.length);
                            return sorted[0];
                        }
                    }

                    if (countryResult && !countryResult.errors) return countryResult;
                    if (!stateResult && countryResult) return countryResult;
                    if (stateResult && stateResult.errors) return countryResult;
                    if (stateResult) return stateResult;
                }

                const res = getResult();
                // console.warn({ res })
                return res;

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




        return { errors: [`City, state and country combination cannot be uniquely identified: ${location.city}, ${location.state}, ${location.country}`] }

    }


    return (location, defaultLocation) => {
        const res = lookupRegion(location, defaultLocation);
        return res;
        // if (res.errors) {
        //     const res2 = lookupRegion({ ...location, ...defaultLocation });
        //     return res2.errors ? res : res2;
        // }
        // return res;
    }

}
