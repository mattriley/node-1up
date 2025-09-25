module.exports = ({ self, fun }) => config => {

    const defaults = { defer: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (...args) => {
        const opts = parseOptions();

        return self.core.configure({ args, ...opts }, ({ state, stepResult }) => {
            return Object.assign(state ?? {}, stepResult);
        });
    };

};
