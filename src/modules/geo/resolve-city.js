module.exports = ({ self, arr }) => csc => {
    let { city: cityKey, state: stateKey, country: countryKey } = csc;

    const result = { ...csc };

    const normalize = s => s?.trim();

    cityKey = normalize(cityKey);
    stateKey = normalize(stateKey);
    countryKey = normalize(countryKey);

    const inferCountry = () => {
        if (countryKey) return self.finder.findCountry(countryKey);

        // Try state → country
        if (stateKey) {
            const state = arr.only(self.finder.findStates(stateKey));
            if (state) {
                result.country = state.countryName;
                countryKey = state.countryCode;
                return self.finder.findCountry(state.countryCode);
            }
        }

        // Try city → country
        if (cityKey) {
            const city = arr.only(self.finder.findCities(cityKey));
            if (city) {
                result.country = city.countryName;
                countryKey = city.countryCode;
                return self.finder.findCountry(city.countryCode);
            }
        }

        // Try city + state → country
        if (cityKey && stateKey) {
            const cities = self.finder.findCities(cityKey);
            const states = self.finder.findStates(stateKey);
            const city = arr.only(cities.filter(c => states.some(s => s.isoCode === c.stateCode)));
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                }
                result.country = city.countryName;
                countryKey = city.countryCode;
                return self.finder.findCountry(city.countryCode);
            }
        }

        return { name: countryKey };
    };

    const inferState = () => {
        if (stateKey && countryKey) {
            return self.finder.findState(stateKey, countryKey);
        }

        // Try city → state
        if (cityKey) {
            const city = arr.only(self.finder.findCities(cityKey));
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                    countryKey = city.countryCode;
                    return state;
                }
            }
        }

        // Try city + country → state
        if (cityKey && countryKey) {
            const city = arr.only(self.finder.findCities(cityKey).filter(c => c.countryCode === countryKey));
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                    return state;
                }
            }
        }

        return { name: stateKey };
    };

    const inferCity = () => {
        if (cityKey && stateKey && countryKey) {
            return self.finder.findCity(cityKey, stateKey, countryKey);
        }

        // Try cities of state → only one?
        if (!cityKey && stateKey && countryKey) {
            const cities = self.finder.findCitiesOfState(stateKey, countryKey);
            const city = arr.only(cities);
            if (city) {
                result.city = city.name;
                cityKey = city.name;
                return city;
            }
        }

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
