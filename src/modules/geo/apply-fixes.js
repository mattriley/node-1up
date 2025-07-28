const replacements = {
    'Region': '',
    'Prefecture': '',
    'Ō': 'O',
    'ō': 'o'
};

module.exports = ({ str }) => ({ cities, states, countries }) => {

    // Cities
    {
        // Assign Hong Kong and Macao to China.
        cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
            city.stateCode = city.countryCode;
            city.countryCode = 'CN';
        });

        // Apply string replacements.
        for (const city of cities) {
            if (!city.state) continue;
            const state = str.applyReplacements(city.state, replacements);
            if (state === city.state) continue;
            Object.assign(city, { state, stateOrig: city.state });
        }
    }

    // States
    {
        // Rename Malacca (state) to Melaka.
        const malaccaState = states.find(state => state.name === 'Malacca' && state.countryCode === 'MY');
        Object.assign(malaccaState, { name: 'Melaka', nameOrig: malaccaState.name });

        // Apply string replacements.
        for (const state of states) {
            const name = str.applyReplacements(state.name, replacements);
            if (name === state.name) continue;
            Object.assign(state, { name, nameOrig: state.name });
        }
    }

    return { cities, states, countries };

};
