module.exports = () => str => {

    // return str.replace(/[^A-Za-z0-9]/g, ch => config.accentReplacements[ch] || ch);

    return str.normalize('NFD')       // decompose letters into base + diacritic
        .replace(/[\u0300-\u036f]/g, ''); // remove all combining diacritic marks


}
