const _ = require('lodash');
const { Country, State, City } = require('country-state-city');

const allCountries = Country.getAllCountries();
const allStates = State.getAllStates();
const allCities = City.getAllCities();

const hk = allStates.find(s => s.name === 'Hong Kong SAR');
allStates.push({ ...hk, name: 'Hong Kong' });

const mo = allStates.find(s => s.name === 'Macau SAR');
allStates.push({ ...mo, name: 'Macau' });

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

const findCities = city => {
    city = city?.toLowerCase();
    return lookup.city.byName[city] || [];
}

const findStates = state => {
    state = state?.toLowerCase();
    return lookup.state.byName[state] || lookup.state.byIso[state] || [];
};

const findCountries = country => {
    country = country?.toLowerCase();
    return lookup.country.byName[country] || lookup.country.byIso[country] || [];
}

const exactState = (state, country) => {
    const states = findStates(state, country);
    if (states.length === 1) return states[0];
}

const exactCountry = (country) => {
    const countries = findCountries(country.toLowerCase());
    if (countries.length === 1) return countries[0];
}

const normalise = obj => _.mapValues(obj, val => val?.trim().toLowerCase());

module.exports = () => (location, defaultLocation = {}) => {
    const { city, state, country } = normalise(location);
    const { country: defaultCountry } = normalise(defaultLocation);

    let cityData;
    let stateData;
    let countryData;

    // Get initial matches
    const cities = findCities(city);
    const states = findStates(state);
    const countries = findCountries(country || defaultCountry);

    // Find country first (either direct or default)
    if (countries.length > 0) {
        countryData = countries[0];
    }

    // Find state (with country context if available)
    if (states.length === 1) {
        stateData = states[0];
        countryData ??= exactCountry(stateData.countryCode);
    } else if (states.length > 0 && countryData) {
        const matchingState = states.find(s => s.countryCode === countryData.isoCode);
        if (matchingState) stateData = matchingState;
    }

    // Find city (with state and country context)
    if (cities.length === 1) {
        cityData = cities[0];
        stateData ??= exactState(cityData.stateCode);
        countryData ??= exactCountry(cityData.countryCode);
    } else if (cities.length > 0) {
        let matchingCities = cities;

        if (countryData) {
            matchingCities = matchingCities.filter(c => c.countryCode === countryData.isoCode);
        }

        if (stateData) {
            matchingCities = matchingCities.filter(c => c.stateCode === stateData.isoCode);
        }

        if (matchingCities.length > 0) {
            cityData = matchingCities[0];
            stateData ??= exactState(cityData.stateCode);
            countryData ??= exactCountry(cityData.countryCode);
        }
    }

    // Log warnings for missing data
    if (city && !cityData) console.warn(`City not found: ${city}`);
    if (state && !stateData) console.warn(`State not found: ${state}`);
    if ((country || defaultCountry) && !countryData) {
        console.warn(`Country not found: ${country || defaultCountry}`);
    }

    return {
        city: cityData?.name,
        state: stateData?.name,
        'state.iso': stateData?.isoCode,
        country: countryData?.name,
        'country.iso2': countryData?.isoCode
    };
};
