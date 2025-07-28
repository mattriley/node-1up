module.exports = ({ config }) => str => {

    return str.replace(/[^A-Za-z0-9]/g, ch => config.accentReplacements[ch] || ch);

}
