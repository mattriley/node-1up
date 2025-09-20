module.exports = () => ({ states, admin1Codes }) => {

    const missingStates = admin1Codes.flatMap(admin1Code => {
        const state = states.find(state => state.name === admin1Code.name && state.countryCode === admin1Code.countryCode);
        if (state) return [];
        return {
            'name': admin1Code.name,
            'isoCode': admin1Code.isoCode,
            'countryCode': admin1Code.countryCode
        };
    });

    return [...states, ...missingStates];

};
