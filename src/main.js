const compose = require('./compose');
const { modules } = compose();

const functionAliases = {
    Value: 'Val'
};

const moduleAliases = {
    array: ['a', 'ar', 'arr'],
    filesystem: ['fs'],
    function: ['f', 'fn', 'fun', 'func'],
    object: ['o', 'ob', 'obj'],
    string: ['s', 'st', 'str']
};

module.exports = modules.function.pipe([
    modules => {
        return modules.object.mapValues(modules, (name, module) => {
            return modules.object.flatMapKeys(module, (val, key) => {
                const aliasKeys = Object.entries(functionAliases).map(([from, to]) => key.replace(from, to));
                return [key, ...aliasKeys];
            });
        });
    },
    modules => {
        return Object.entries(moduleAliases).reduce((acc, [name, aliases]) => {
            return { ...acc, ...Object.fromEntries(aliases.map(alias => [alias, modules[name]])) }
        }, modules);
    }
], modules);
