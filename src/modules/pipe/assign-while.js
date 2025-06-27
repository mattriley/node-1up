module.exports = ({ self }) => (...args) => {

    return self.with({ args }, ({ state, stepResult }) => {
        return Object.assign(state, stepResult);
    });

};
