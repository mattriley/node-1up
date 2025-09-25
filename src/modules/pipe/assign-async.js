module.exports = ({ self }) => (...args) => {

    return self.core.configure({ args, async: true }, ({ state, stepResult }) => {
        return Object.assign(state ?? {}, stepResult);
    });

};
