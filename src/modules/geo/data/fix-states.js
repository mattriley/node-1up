const replacements = {
    'Region': '',
    'Prefecture': '',
    'Province': ''
};

const countriesToRemoveStatesFrom = ['SG'];

module.exports = ({ str }) => states => {

    // Rename Malacca (state) to Melaka.
    const malaccaState = states.find(state => state.name === 'Malacca' && state.countryCode === 'MY');
    if (malaccaState) Object.assign(malaccaState, { name: 'Melaka', nameOrig: malaccaState.name });

    // Remove states from certain countries.
    states = states.filter(state => {
        return !countriesToRemoveStatesFrom.includes(state.countryCode);
    });

    // Apply string replacements.
    for (const state of states) {
        let name = str.applyReplacements(state.name, replacements);
        name = str.deaccent(name);
        if (name === state.name) continue;
        Object.assign(state, { name, nameOrig: state.name });
    }

    return states;
};
