module.exports = () => str => {

    return str.normalize('NFD')           // decompose letters into base + diacritic
        .replace(/[\u0300-\u036f]/g, ''); // remove all combining diacritic marks

}
