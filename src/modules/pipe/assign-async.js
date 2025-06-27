module.exports = ({ self }) => (...args) => {

    return self.with({ args, async: true }, ({ state, stepResult }) => {
        return Object.assign(state, stepResult);
    });

};
