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
    const errors = {};
    const source = {};

    const addError = (field, code, message) => {
        if (!errors[field]) errors[field] = [];
        const exists = errors[field].some(e => e.code === code && e.message === message);
        if (!exists) errors[field].push({ code, message });
    };

    const markSource = (field, inferred) => {
        source[field] = original[field] ? 'input' : inferred ? 'inferred' : null;
    };

    const findCityMatch = () => {
        if (!cityKey) return null;

        const all = self.finder.findCities(cityKey);
        const byCountry = countryKey ? all.filter(c => c.countryCode === countryKey) : all;
        const byState = stateKey
            ? byCountry.filter(c => self.finder.findStates(stateKey).some(s => c.stateCode === s.isoCode))
            : byCountry;

        const city = arr.only(byState);
        if (!city && byState.length > 1) {
            const context = countryKey
                ? `in ${countryKey}`
                : stateKey
                    ? `matching state ${stateKey}`
                    : 'globally';

            addError('city', ERROR_CODES.AMBIGUOUS, `Ambiguous: ${cityKey} (${byState.length} matches ${context})`);
        }

        return city;
    };

    const inferCountry = () => {
        if (countryKey) {
            const country = self.finder.findCountry(countryKey);
            if (country) return country;
            addError('country', ERROR_CODES.INVALID, `Invalid country code: ${countryKey}`);
        }

        if (stateKey) {
            const state = arr.only(self.finder.findStates(stateKey));
            const country = state && self.finder.findCountry(state.countryCode);
            if (country) {
                result.country = country.name;
                countryKey = country.isoCode;
                markSource('country', true);
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
                    markSource('country', true);
                    return country;
                }
            }
        }

        addError('country', ERROR_CODES.MISSING, 'No country could be inferred from input');
        return null;
    };

    const inferState = () => {
        if (stateKey && countryKey) {
            const state = self.finder.findState(stateKey, countryKey);
            if (state) return state;
            addError('state', ERROR_CODES.INVALID, `Invalid state for country: ${stateKey} / ${countryKey}`);
        }

        if (!cityKey) {
            addError('state', ERROR_CODES.MISSING, 'State could not be inferred (no city provided)');
            return null;
        }

        const city = findCityMatch();
        if (city) {
            // const state = city.stateCode ? self.finder.findState(city.stateCode, city.countryCode) : null;
            const stateSearchKey = city.state || city.stateCode;
            const state = stateSearchKey ? self.finder.findState(stateSearchKey, city.countryCode) : null;
            if (state) {
                result.state = state.name;
                stateKey = state.isoCode;
                countryKey = city.countryCode;
                markSource('state', true);
                return state;
            }
        }

        addError('state', ERROR_CODES.MISSING, 'State could not be inferred from city');
        return null;
    };

    const inferCity = () => {
        if (cityKey && stateKey && countryKey) {
            const city = self.finder.findCity(cityKey, stateKey, countryKey);
            if (city) return city;
        }

        if (cityKey && (!stateKey || !countryKey)) {
            const match = findCityMatch(); // this handles filtering and ambiguity
            if (match) return match;
        }

        if (!cityKey && stateKey && countryKey) {
            const cities = self.finder.findCitiesOfState(stateKey, countryKey);
            const city = arr.only(cities);
            if (city) {
                result.city = city.name;
                cityKey = city.name;
                markSource('city', true);
                return city;
            }
        }

        addError('city', ERROR_CODES.MISSING, 'City is required or must be inferred');
        return null;
    };


    const country = inferCountry();
    const state = inferState();
    const city = inferCity();

    const complete = Boolean(city?.name && state?.name && state?.isoCode && country?.name && country?.isoCode);

    const resolveField = (field, name, code) => ({
        name: name ?? original[field] ?? null,
        code: code ?? null,
        source: source[field] ?? (original[field] ? 'input' : null),
        ...(errors[field]?.length ? { errors: errors[field] } : {})
    });

    return {
        city: resolveField('city', city?.name, null),
        state: resolveField('state', state?.name, state?.isoCode),
        country: resolveField('country', country?.name, country?.isoCode),
        csc: {
            city: city?.name ?? original.city ?? null,
            state: state?.name ?? original.state ?? null,
            stateCode: state?.isoCode ?? null,
            country: country?.name ?? original.country ?? null,
            countryCode: country?.isoCode ?? null,
            timezone: city?.timezone ?? null
        },
        complete
    };
};
