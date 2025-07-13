module.exports = states => {

    const malacca = states.find(state => state.name === 'Malacca' && state.countryCode === 'MY');
    states.push({ ...malacca, name: 'Melaka' })

    states.filter(state => state.name.endsWith('Prefecture')).forEach(state => {
        const full = state.name;
        const name = state.name.replace('Prefecture', '').replace('Ō', 'O').replace('ō', 'o').trim();
        states.push({ ...state, name, full });
    });

    states.filter(state => state.name.endsWith('Region')).forEach(state => {
        const full = state.name;
        const name = state.name.replace('Region', '').trim();
        states.push({ ...state, name, full });
    });

    return states;
}
