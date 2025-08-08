module.exports = ({ fsp, fun, globalConfig }) => config => {

    const defaults = { indent: globalConfig.jsonIndent };
    const parseOptions = fun.parseConfig(defaults, config);

    return async (filepath, data, ...options) => {
        const { indent } = parseOptions(options);

        try {
            const json = JSON.stringify(data, null, indent);
            await fsp.writeFile(filepath, json);
        } catch (err) {
            err.data = { filepath };
            throw err;
        }
    };
};
