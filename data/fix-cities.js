const replacements = {
    'Region': '',
    'Prefecture': '',
    'Ō': 'O',
    'ō': 'o'
};

function applyReplacements(str) {
    let result = str;
    for (const [key, value] of Object.entries(replacements)) {
        // split by key and join with replacement
        result = result.split(key).join(value);
    }
    return result;
}

module.exports = cities => {

    // const northShore = cities.find(state => state.name === 'North Shore' && state.countryCode === 'NZ')
    // cities.push({ ...northShore, name: 'Auckland' });

    cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
        city.stateCode = city.countryCode;
        city.countryCode = 'CN';
    });

    for (const city of cities) {
        if (!city.state) continue;
        const state = applyReplacements(city.state).trim();
        if (state === city.state) continue;
        Object.assign(city, { state, stateOrig: city.state });
    }

    return cities;

};
