module.exports = ({ self }) => config => {

    const defaults = { defer: false };
    const parseOptions = fun.parseConfig(defaults, config);

    return (...args) => {
        const { defer } = parseOptions();

        const exec = self.with({ args }, ({ state, stepResult }) => {
            return Object.assign(state ?? {}, stepResult);
        });

        return defer ? exec : exec();

    };

};
