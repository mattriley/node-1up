const compose = require('./compose');
const { modules } = compose();

const aliases = {
    array: ['a', 'ar', 'arr'],
    filesystem: ['fs'],
    function: ['f', 'fn', 'fun', 'func'],
    object: ['o', 'ob', 'obj'],
    string: ['s', 'st', 'str']
};

module.exports = Object.entries(aliases).reduce((acc, [name, aliases]) => {
    return { ...acc, ...Object.fromEntries(aliases.map(alias => [alias, modules[name]])) }
}, modules);
