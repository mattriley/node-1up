const replacements = {
    'Region': '',
    'Prefecture': ''
};

module.exports = ({ str }) => ({ cities = [], states = [], countries = [] }) => {

    // Cities
    {
        // Assign Hong Kong and Macao to China.
        cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
            city.stateCode = city.countryCode;
            city.countryCode = 'CN';
        });

        // Taiwan is not a state - remove.
        for (const city of cities) {
            if (!city.state) continue;
            if (city.state === 'Taiwan') delete city.state;
        }

        // Apply string replacements.
        for (const city of cities) {
            if (!city.state) continue;
            let state = str.applyReplacements(city.state, replacements);
            state = str.removeAccents(state);
            if (state === city.state) continue;
            Object.assign(city, { state, stateOrig: city.state });
        }
    }

    // States
    {
        // Rename Malacca (state) to Melaka.
        const malaccaState = states.find(state => state.name === 'Malacca' && state.countryCode === 'MY');
        if (malaccaState) Object.assign(malaccaState, { name: 'Melaka', nameOrig: malaccaState.name });

        // Apply string replacements.
        for (const state of states) {
            let name = str.applyReplacements(state.name, replacements);
            name = str.removeAccents(name);
            if (name === state.name) continue;
            Object.assign(state, { name, nameOrig: state.name });
        }
    }

    // Countries
    {

        // Singapore does not have states.
        const removeStatesFrom = ['Singapore'];
        for (const country of countries) {
            if (!removeStatesFrom.includes(country)) continue;
            if (country.state) delete country.state;
        }

    }

    return { cities, states, countries };

};
