module.exports = ({ self }) => (...args) => {

    return self.core.configure({ args }, ({ state, stepResult }) => {
        return Object.assign(state ?? {}, stepResult);
    });

};
