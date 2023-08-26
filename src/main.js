const compose = require('./compose');
const { modules } = compose();

const functionAliases = {
    Value: 'Val'
};

module.exports = modules.function.pipe([
    modules => {
        return modules.object.mapValues(modules, (name, module) => {
            return modules.object.flatMapKeys(module, (val, key) => {
                const aliasKeys = Object.entries(functionAliases).map(([from, to]) => key.replace(from, to));
                return [key, ...aliasKeys];
            });
        });
    }
], modules);

// console.warn(module.exports);
