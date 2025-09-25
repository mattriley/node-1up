module.exports = ({ self, fun }) => {

    return config => {
        const defaults = { defer: false };
        const parseOptions = fun.parseConfig(defaults, config);

        return (...args) => {
            const { defer } = parseOptions();

            const exec = self.core.configure({ args }, ({ state, stepResult }) => {
                return Object.assign(state ?? {}, stepResult);
            });

            return defer ? exec : exec();
        };
    };
}
