module.exports = ({ fsp, fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.json, config);

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
