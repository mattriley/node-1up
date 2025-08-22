const replacements = {
    'Region': '',
    'Prefecture': '',
    'Province': ''
};

const countriesToRemoveStatesFrom = ['SG'];

module.exports = ({ str }) => cities => {

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

    // Remove states from certain countries.
    for (const city of cities) {
        if (!countriesToRemoveStatesFrom.includes(city.countryCode)) continue;
        delete city.stateCode;
    }

    // Apply string replacements to states
    for (const city of cities) {
        if (!city.state) continue;
        let state = str.applyReplacements(city.state, replacements);
        state = str.deaccent(state);
        if (state === city.state) continue;
        Object.assign(city, { state, stateOrig: city.state });
    }

    // Apply string replacements to cities
    for (const city of cities) {
        if (!city.name) continue;
        let name = str.applyReplacements(city.name, replacements);
        name = str.deaccent(name);
        if (name === city.name) continue;
        Object.assign(city, { name, nameOrig: city.name });
    }

    return cities;
};
