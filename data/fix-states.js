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

module.exports = states => {

    const malacca = states.find(state => state.name === 'Malacca' && state.countryCode === 'MY');
    states.push({ ...malacca, name: 'Melaka' })

    for (const state of states) {
        const name = applyReplacements(state.name).trim();
        if (name === state.name) continue;
        Object.assign(state, { name, nameOrig: state.name });
    }

    return states;
}
