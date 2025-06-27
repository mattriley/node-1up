const merge = require('lodash.merge');

module.exports = ({ self }) => (...args) => {

    return self.with({ args }, ({ state, stepResult }) => {
        return merge(state ?? {}, stepResult);
    });

}
