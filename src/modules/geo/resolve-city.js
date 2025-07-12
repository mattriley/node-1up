module.exports = ({ self, arr }) => csc => {

    let cityKey = csc.city;
    let stateKey = csc.state;
    let countryKey = csc.country;

    const result = { ...csc };

    const inferCountry = () => {
        // Case 1: Infer from state
        if (!countryKey && stateKey) {
            const states = self.finder.findStates(stateKey);
            const state = arr.only(states);
            if (state) {
                const country = self.finder.findCountry(state.countryCode);
                if (country) {
                    result.country = country.name;
                    countryKey = country.isoCode;
                    return country;
                }
            }
        }

        // Case 2: Infer from city
        if (!countryKey && cityKey) {
            const cities = self.finder.findCities(cityKey);
            const city = arr.only(cities);
            if (city) {
                const country = self.finder.findCountry(city.countryCode);
                if (country) {
                    result.country = country.name;
                    countryKey = country.isoCode;
                    return country;
                }
            }
        }

        // ✅ New Case 3: Infer from city + state combination
        if (!countryKey && cityKey && stateKey) {
            const cities = self.finder.findCities(cityKey);
            const states = self.finder.findStates(stateKey);

            const citiesInStates = cities.filter(city => states.find(state => city.stateCode === state.isoCode));
            const city = arr.only(citiesInStates);

            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                const country = self.finder.findCountry(city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                }
                if (country) {
                    result.country = country.name;
                    countryKey = country.isoCode;
                    return country;
                }
            }
        }

        // Case 4: Already have country key
        const country = countryKey ? self.finder.findCountry(countryKey) : null;
        if (country) return country;
        return { name: countryKey };
    };


    const inferState = () => {
        if (!stateKey && cityKey) {
            const cities = self.finder.findCities(cityKey);
            const city = arr.only(cities);
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                    return state;
                }
            }
        }

        if (!stateKey && countryKey) {
            const countries = self.finder.findCountries(countryKey);
            const country = arr.only(countries);
            if (country && cityKey) {
                const cities = self.finder.findCities(cityKey);
                const filteredCities = cities.filter(c => c.countryCode === country.isoCode);
                const city = arr.only(filteredCities);
                if (city) {
                    const state = self.finder.findState(city.stateCode, city.countryCode);
                    if (state) {
                        result.state = state.name;
                        stateKey = state.isoCode;
                        return state;
                    }
                }
            }
        }

        const state = stateKey && countryKey ? self.finder.findState(stateKey, countryKey) : null;
        if (state) return state;
        return { name: stateKey };
    };

    const inferCity = () => {
        if (!cityKey && stateKey && countryKey) {
            const states = self.finder.findStates(stateKey);
            const countries = self.finder.findCountries(countryKey);
            const state = arr.only(states);
            const country = arr.only(countries);
            if (state && country) {
                const cities = self.finder.findCitiesOfState(state.isoCode, country.isoCode);
                const city = arr.only(cities);
                if (city) {
                    result.city = city.name;
                    cityKey = city.name;
                    return city;
                }
            }
        }

        const city = cityKey && stateKey && countryKey ? self.finder.findCity(cityKey, stateKey, countryKey) : null;
        if (city) return city;
        return { name: cityKey };
    };

    const country = inferCountry();
    const state = inferState();
    const city = inferCity();

    return {
        city: city?.name,
        state: state?.name,
        stateCode: state?.isoCode,
        country: country?.name,
        countryCode: country?.isoCode,
    };

};
