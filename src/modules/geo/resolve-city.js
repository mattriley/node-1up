module.exports = ({ self, arr }) => csc => {
    const ERROR_CODES = {
        MISSING: 'missing',
        AMBIGUOUS: 'ambiguous',
        INVALID: 'invalid',
        CONFLICT: 'conflict',
    };

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
    const errors = {};

    const addError = (field, code, message) => {
        if (!errors[field]) errors[field] = [];
        const exists = errors[field].some(e => e.code === code && e.message === message);
        if (!exists) {
            errors[field].push({ code, message });
        }
    };

    const markInferred = field => {
        if (!original[field]) {
            inferred.push(field);
            source[field] = 'inferred';
        } else {
            source[field] = 'input';
        }
    };

    const findCityMatch = () => {
        if (!cityKey) return null;

        const all = self.finder.findCities(cityKey);
        const byCountry = countryKey ? all.filter(c => c.countryCode === countryKey) : all;
        const byState = stateKey
            ? byCountry.filter(c =>
                self.finder.findStates(stateKey).some(s => c.stateCode === s.isoCode)
            )
            : byCountry;

        const city = arr.only(byState);

        if (!city && byState.length > 1) {
            const context = countryKey
                ? `in ${countryKey}`
                : stateKey
                    ? `matching state ${stateKey}`
                    : 'across all countries';

            addError(
                'city',
                ERROR_CODES.AMBIGUOUS,
                `Ambiguous: ${cityKey} (${byState.length} matches ${context})`
            );
        }

        return city;
    };

    const inferCountry = () => {
        if (countryKey) {
            const country = self.finder.findCountry(countryKey);
            if (country) {
                markInferred('country');
                return country;
            } else {
                addError('country', ERROR_CODES.INVALID, `Invalid country code: ${countryKey}`);
            }
        }

        if (stateKey) {
            const state = arr.only(self.finder.findStates(stateKey));
            const country = state && self.finder.findCountry(state.countryCode);
            if (country) {
                result.country = country.name;
                countryKey = country.isoCode;
                markInferred('country');
                return country;
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

        if (!original.country) {
            addError('country', ERROR_CODES.MISSING, 'No country could be inferred from input');
        }

        return null;
    };

    const inferState = () => {
        if (stateKey && countryKey) {
            const state = self.finder.findState(stateKey, countryKey);
            if (state) {
                markInferred('state');
                return state;
            } else {
                addError('state', ERROR_CODES.INVALID, `Invalid state for country: ${stateKey} / ${countryKey}`);
            }
        }

        if (!cityKey) {
            if (!original.state) {
                addError('state', ERROR_CODES.MISSING, 'State could not be inferred (no city provided)');
            }
            return null;
        }

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

        if (!original.state) {
            addError('state', ERROR_CODES.MISSING, 'State could not be inferred from city');
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

        if (!original.city) {
            addError('city', ERROR_CODES.MISSING, 'City is required or must be inferred');
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
        ...(Object.keys(errors).length > 0 ? { errors } : {})
    };
};
