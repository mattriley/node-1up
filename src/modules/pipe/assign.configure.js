module.exports = ({ self, fun }) => config => {
    const defaults = { defer: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (...args) => {
        const options = parseOptions();

        return self.core.configure({ args, ...options }, ({ state, stepResult }) => {
            return Object.assign(state ?? {}, stepResult);
        });
    };

};
