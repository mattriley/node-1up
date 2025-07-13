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
    const source = {};
    const errors = [];

    const markInferred = field => {
        if (!original[field]) {
            inferred.push(field);
            source[field] = 'inferred';
        } else {
            source[field] = 'input';
        }
    };

    const findCityMatch = () => {
        const all = self.finder.findCities(cityKey);

        const byCountry = countryKey
            ? all.filter(c => c.countryCode === countryKey)
            : all;

        const byState = stateKey
            ? byCountry.filter(c => self.finder.findStates(stateKey).some(s => s.isoCode === c.stateCode))
            : byCountry;

        const city = arr.only(byState);
        if (!city && byState.length > 1) {
            errors.push(`Ambiguous city: ${cityKey} (${byState.length} matches)`);
        }
        return city;
    };

    const inferCountry = () => {
        if (countryKey) {
            const country = self.finder.findCountry(countryKey);
            if (country) {
                markInferred('country');
                return country;
            }
        }

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
            const city = findCityMatch();
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

        return null;
    };

    const inferState = () => {
        if (stateKey && countryKey) {
            const state = self.finder.findState(stateKey, countryKey);
            if (state) {
                markInferred('state');
                return state;
            }
        }

        if (cityKey) {
            const city = findCityMatch();
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

        return null;
    };

    const inferCity = () => {
        if (cityKey && stateKey && countryKey) {
            const city = self.finder.findCity(cityKey, stateKey, countryKey);
            if (city) {
                markInferred('city');
                return city;
            }
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

        return null;
    };

    const country = inferCountry();
    const state = inferState();
    const city = inferCity();

    const complete =
        Boolean(city?.name) &&
        Boolean(state?.name) &&
        Boolean(state?.isoCode) &&
        Boolean(country?.name) &&
        Boolean(country?.isoCode);

    return {
        city: city?.name ?? original.city,
        state: state?.name ?? original.state,
        stateCode: state?.isoCode,
        country: country?.name ?? original.country,
        countryCode: country?.isoCode,
        inferred,
        source,
        complete,
        ...(errors.length > 0 ? { errors } : {})
    };
};
