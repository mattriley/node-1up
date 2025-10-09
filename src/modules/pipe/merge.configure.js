const merge = require('lodash.merge');

module.exports = ({ self, fun }) => config => {

    const defaults = { defer: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (...args) => {
        const options = parseOptions();

        return self.core.configure({ ...options, args }, ({ state, stepResult }) => {
            return merge(state ?? {}, stepResult);
        });
    };

};
