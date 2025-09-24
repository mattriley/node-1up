module.exports = ({ self }) => config => (...args) => {

    return self.with({ args }, ({ state, stepResult }) => {
        return Object.assign(state ?? {}, stepResult);
    });

};
