module.exports = ({ self, arr }) => csc => {
    const normalize = s => s?.trim();

    const original = {
        city: normalize(csc.city),
        state: normalize(csc.state),
        country: normalize(csc.country),
    };

    let { city: cityKey, state: stateKey, country: countryKey } = original;

    const result = { ...csc };
    const inferred = [];

    const markInferred = field => {
        if (!original[field]) inferred.push(field);
    };

    const inferCountry = () => {
        if (countryKey) return self.finder.findCountry(countryKey);

        if (stateKey) {
            const state = arr.only(self.finder.findStates(stateKey));
            if (state) {
                const country = self.finder.findCountry(state.countryCode);
                if (country) {
                    result.country = country.name;
                    countryKey = country.isoCode;
                    markInferred('country');
                    return country;
                }
            }
        }

        if (cityKey) {
            const city = arr.only(self.finder.findCities(cityKey));
            if (city) {
                const country = self.finder.findCountry(city.countryCode);
                if (country) {
                    result.country = country.name;
                    countryKey = country.isoCode;
                    markInferred('country');
                    return country;
                }
            }
        }

        if (cityKey && stateKey) {
            const cities = self.finder.findCities(cityKey);
            const states = self.finder.findStates(stateKey);
            const city = arr.only(cities.filter(c => states.some(s => s.isoCode === c.stateCode)));
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                    markInferred('state');
                }
                const country = self.finder.findCountry(city.countryCode);
                if (country) {
                    result.country = country.name;
                    countryKey = country.isoCode;
                    markInferred('country');
                    return country;
                }
            }
        }

        return { name: countryKey };
    };

    const inferState = () => {
        if (stateKey && countryKey) {
            const state = self.finder.findState(stateKey, countryKey);
            if (state) return state;
        }

        if (cityKey) {
            const city = arr.only(self.finder.findCities(cityKey));
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                    countryKey = city.countryCode;
                    markInferred('state');
                    return state;
                }
            }
        }

        if (cityKey && countryKey) {
            const city = arr.only(self.finder.findCities(cityKey).filter(c => c.countryCode === countryKey));
            if (city) {
                const state = self.finder.findState(city.stateCode, city.countryCode);
                if (state) {
                    result.state = state.name;
                    stateKey = state.isoCode;
                    markInferred('state');
                    return state;
                }
            }
        }

        return { name: stateKey };
    };

    const inferCity = () => {
        if (cityKey && stateKey && countryKey) {
            const city = self.finder.findCity(cityKey, stateKey, countryKey);
            if (city) return city;
        }

        if (!cityKey && stateKey && countryKey) {
            const cities = self.finder.findCitiesOfState(stateKey, countryKey);
            const city = arr.only(cities);
            if (city) {
                result.city = city.name;
                cityKey = city.name;
                markInferred('city');
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
        inferred
    };
};
