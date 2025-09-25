const merge = require('lodash.merge');

module.exports = ({ self }) => (...args) => {

    return self.core.configure({ args }, ({ state, stepResult }) => {
        return merge(state ?? {}, stepResult);
    });

};
