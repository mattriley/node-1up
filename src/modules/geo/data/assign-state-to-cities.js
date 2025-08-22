module.exports = () => ({ cities, states, admin1Codes }) => {

    return cities.map(city => {

        const matches = admin1Codes.filter(a => a.countryCode === city.countryCode && a.isoCode === city.stateCode);
        if (matches.length > 1) {
            throw new Error(`Ambiguous admin code for city: ${city}`);
        }
        const adminArea = matches[0];
        if (!adminArea) return city;

        const state = states.find(s => s.countryCode === city.countryCode && s.name === adminArea.name);
        const stateCode = state ? state.isoCode : null;

        return {
            ...city,
            state: adminArea.name,
            stateCode
        };
    });

};
