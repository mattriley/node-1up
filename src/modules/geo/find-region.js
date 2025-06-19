const _ = require('lodash');

const buildLookup = () => {
    const { Country, State, City } = require('country-state-city');

    const allCountries = Country.getAllCountries();
    const allStates = State.getAllStates();
    const allCities = City.getAllCities();

    const hk = allStates.find(s => s.name === 'Hong Kong SAR');
    if (hk) hk.name = 'Hong Kong';

    const mo = allStates.find(s => s.name === 'Macau SAR');
    if (mo) mo.name = 'Macau';

    const lookupPlan = {
        country: [allCountries, 'name', 'isoCode'],
        state: [allStates, 'name', 'isoCode'],
        city: [allCities, 'name']
    };

    const lookup = _.mapValues(lookupPlan, args => {
        const [items, ...keyNames] = args;
        return Object.assign(...keyNames.map(keyName => _.groupBy(items, item => item[keyName].toLowerCase())));
    });

    lookup.allStates = allStates;

    return lookup;
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


module.exports = ({ arr }) => location => {

    let lookup; // Lazy load

    if (!lookup) {
        lookup = buildLookup();
    }


    const findCities = (cityKey, cont) => {
        cityKey = cityKey?.toLowerCase();
        const cities = lookup.city[cityKey] || [];
        return arr.poly(cities, cont);
    }


    const findStates = (stateKey, cont) => {
        stateKey = stateKey?.toLowerCase();
        const states = lookup.state[stateKey];
        return arr.poly(states, cont);
    };



    const findCountries = (countryKey, cont) => {
        countryKey = countryKey?.toLowerCase();
        const countries = lookup.country[countryKey];
        return arr.poly(countries, cont);
    }



    const cityKey = location.city?.trim().toLowerCase();
    const stateKey = location.state?.trim().toLowerCase();
    const countryKey = location.country?.trim().toLowerCase();

    // CITY


    if (cityKey) {
        const [city, cities] = findCities(cityKey, []);
        if (city) {
            const state = findStates(city.stateCode);
            const country = findCountries(city.countryCode);
            return result(city, state, country, ['city']);
        }


        // CITY IS AMBIGUOUS
        if (cities) {


            const byCountry = () => {

                if (countryKey) {
                    const country = findCountries(countryKey);

                    if (cityKey) {
                        const [city, cities] = findCities(cityKey, []);

                        if (city) { // BEGIN: CITY IS KNOWN
                            const [state, states] = findStates(city.stateCode, []);
                            if (state) {
                                return result(city, state, country, ['city', 'country']);
                            }
                            {
                                const state = arr.only(states, state => state.countryCode === country.isoCode);
                                return result(city, state, country, ['city', 'country']);
                            }
                        } // END

                        if (cities) { // BEGIN: CITY IS AMBIGUOUS 
                            const statesOfCountry = lookup.allStates.filter(state => state.countryCode === country.isoCode);
                            const cities2 = cities.filter(city => statesOfCountry.filter(state => state.isoCode === city.stateCode).length === 1);
                            if (cities2.length > 1) {
                                return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
                            }
                            if (cities2.length === 1) {
                                const city = cities2[0];
                                const state = statesOfCountry.find(state => state.isoCode === city.stateCode);
                                return result(city, state, country, ['city', 'country']);
                            }
                        } // END

                    }
                    return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
                }

                if (stateKey) {
                    const [, states] = findStates(stateKey, []);
                    // we have states and cities

                    const cities2 = states ? cities?.filter(city => states.filter(state => state.isoCode === city.stateCode).length === 1) : [];
                    const states2 = cities ? states?.filter(state => cities.filter(city => city.stateCode === state.isoCode).length === 1) : [];

                    if (cities2?.length !== 1 && states2?.length !== 1) {
                        return { errors: [`City and state combination cannot be uniquely identified: ${location.city}, ${location.state}`] }
                    }
                }


                return { errors: [`City cannot be uniquely identified: ${location.city}`] }
            }


            const byState = (stateKey) => {
                const [state, states] = findStates(stateKey, []);

                if (state) { // BEGIN: STATE IS KNOWN
                    const city = arr.only(cities, city => city.stateCode === state.isoCode);
                    const country = city ? findCountries(city.countryCode) : null;
                    if (city && country) {
                        return result(city, state, country, ['city', 'state']);
                    }
                } // END

                if (states && countryKey) { // BEGIN: STATE IS AMBIGUOUS
                    const country = findCountries(countryKey);
                    const state = country ? arr.only(states, state => state.countryCode === country.isoCode) : null;
                    const city = state ? arr.only(cities, city => city.stateCode === state.isoCode) : null;
                    if (city && state && country) {
                        return result(city, state, country, ['city', 'state', 'country']);
                    }
                } // END
            }

            const getResult = () => {
                const countryResult = byCountry();
                const stateResult = stateKey ? byState(stateKey) : null;

                if (countryResult && !countryResult.errors) return countryResult;
                if (stateResult && !stateResult.errors) return stateResult;

                if (countryResult && stateResult) {
                    const sorted = _.sortBy([countryResult, stateResult], res => res.unique.length);
                    return sorted[0];
                }

                return countryResult || stateResult;
            }

            const res = getResult();
            // console.warn({ res })
            return res;

        }

    }

    if (stateKey) {
        const [state, states] = findStates(stateKey, []);
        if (state) {
            const country = findCountries(state.countryCode);
            return result(null, state, country, ['state'])
        }
        if (states) {
            if (countryKey) {
                const country = findCountries(countryKey);
                const state = arr.only(states, state => state.countryCode === country.isoCode);
                if (state) {
                    return result(null, state, country, ['state', 'country']);
                }
            }
        }
    }

    if (countryKey) {
        const country = findCountries(countryKey);
        if (country) {
            return result(null, null, country, ['country']);
        }
    }




    return { errors: [`City, state and country combination cannot be uniquely identified: ${location.city}, ${location.state}, ${location.country}`] }

};
