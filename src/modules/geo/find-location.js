module.exports = ({ self, arr }) => {

    const buildResult = (cityData, stateData, countryData, unique) => {
        return self.buildResult(cityData, stateData, countryData, { unique });
    }

    return location => {

        const cityKey = location.city?.trim().toLowerCase();
        const stateKey = location.state?.trim().toLowerCase();
        const countryKey = location.country?.trim().toLowerCase();

        // CITY


        if (cityKey) {
            const cities = self.finder.findCities(cityKey);
            const city = arr.only(cities);

            if (city) {
                const state = city.stateCode && city.countryCode ? self.finder.findState(city.stateCode, city.countryCode) : null;
                const country = self.finder.findCountry(city.countryCode);
                return buildResult(city, state, country, ['city']);
            }


            // CITY IS AMBIGUOUS
            if (cities) {


                const byCountry = () => {

                    if (countryKey) {
                        const countries = self.finder.findCountries(countryKey);
                        const country = arr.only(countries);

                        if (cityKey) {
                            const cities = self.finder.findCities(cityKey);
                            const city = arr.only(cities);

                            if (city) { // BEGIN: CITY IS KNOWN
                                const states = self.finder.findStates(city.stateCode);
                                const state = arr.only(states);

                                if (state) {
                                    return buildResult(city, state, country, ['city', 'country']);
                                }
                                {
                                    const state = arr.only(states, state => state.countryCode === country.isoCode);
                                    return buildResult(city, state, country, ['city', 'country']);
                                }
                            } // END

                            if (cities) { // BEGIN: CITY IS AMBIGUOUS 
                                const statesOfCountry = self.finder.findStatesOfCountry(country.isoCode);
                                const cities2 = cities.filter(city => statesOfCountry.filter(state => state.isoCode === city.stateCode).length === 1);
                                if (cities2.length > 1) {
                                    return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
                                }
                                if (cities2.length === 1) {
                                    const city = cities2[0];
                                    const state = statesOfCountry.find(state => state.isoCode === city.stateCode);
                                    return buildResult(city, state, country, ['city', 'country']);
                                }
                            } // END

                        }
                        return { errors: [`City and country combination cannot be uniquely identified: ${location.city}, ${location.country}`] }
                    }

                    if (stateKey) {
                        const states = self.finder.findStates(stateKey);
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
                    const states = self.finder.findStates(stateKey);
                    const state = arr.only(states);

                    if (state) { // BEGIN: STATE IS KNOWN
                        const city = arr.only(cities, city => city.stateCode === state.isoCode);
                        const countries = city ? self.finder.findCountries(city.countryCode) : [];
                        const country = arr.only(countries);

                        if (city && country) {
                            return buildResult(city, state, country, ['city', 'state']);
                        }
                    } // END

                    if (states && countryKey) { // BEGIN: STATE IS AMBIGUOUS
                        const countries = self.finder.findCountries(countryKey);
                        const country = arr.only(countries);
                        const state = country ? arr.only(states, state => state.countryCode === country.isoCode) : null;
                        const city = state ? arr.only(cities, city => city.stateCode === state.isoCode) : null;
                        if (city && state && country) {
                            return buildResult(city, state, country, ['city', 'state', 'country']);
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
            const states = self.finder.findStates(stateKey);
            const state = arr.only(states);
            if (state) {
                const countries = self.finder.findCountries(state.countryCode);
                const country = arr.only(countries);
                return buildResult(null, state, country, ['state'])
            }
            if (states) {
                if (countryKey) {
                    const countries = self.finder.findCountries(countryKey);
                    const country = arr.only(countries);
                    const state = arr.only(states, state => state.countryCode === country.isoCode);
                    if (state) {
                        return buildResult(null, state, country, ['state', 'country']);
                    }
                }
            }
        }

        if (countryKey) {
            const countries = self.finder.findCountries(countryKey);
            const country = arr.only(countries);
            if (country) {
                return buildResult(null, null, country, ['country']);
            }
        }




        return { errors: [`City, state and country combination cannot be uniquely identified: ${location.city}, ${location.state}, ${location.country}`] }

    };
};
