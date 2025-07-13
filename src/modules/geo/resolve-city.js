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

    const findCityMatch = () => {
        return (
            (cityKey && stateKey && countryKey && self.finder.findCity(cityKey, stateKey, countryKey)) ||
            (cityKey && countryKey && arr.only(self.finder.findCities(cityKey).filter(c => c.countryCode === countryKey))) ||
            (cityKey && stateKey && arr.only(
                self.finder.findCities(cityKey).filter(city =>
                    self.finder.findStates(stateKey).some(state => city.stateCode === state.isoCode)
                )
            )) || // 👈 missing case: match on city + state (no country)
            (cityKey && arr.only(self.finder.findCities(cityKey))) ||
            (stateKey && countryKey && arr.only(self.finder.findCitiesOfState(stateKey, countryKey))) ||
            null
        );
    };


    const inferCountry = () => {
        if (countryKey) return self.finder.findCountry(countryKey);

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

        const city = findCityMatch();
        if (city) {
            const country = self.finder.findCountry(city.countryCode);
            if (country) {
                result.country = country.name;
                countryKey = country.isoCode;
                markInferred('country');

                // Also infer state if missing
                if (!stateKey) {
                    const state = self.finder.findState(city.stateCode, city.countryCode);
                    if (state) {
                        result.state = state.name;
                        stateKey = state.isoCode;
                        markInferred('state');
                    }
                }

                return country;
            }
        }

        return { name: countryKey };
    };

    const inferState = () => {
        if (stateKey && countryKey) {
            return self.finder.findState(stateKey, countryKey);
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

        return { name: stateKey };
    };

    const inferCity = () => {
        if (cityKey && stateKey && countryKey) {
            return self.finder.findCity(cityKey, stateKey, countryKey);
        }

        if (!cityKey && stateKey && countryKey) {
            const city = arr.only(self.finder.findCitiesOfState(stateKey, countryKey));
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
