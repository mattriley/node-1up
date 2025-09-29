module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.json, config);

    return async (filepath, data, options) => {
        const { indent } = parseOptions(options);

        try {
            const json = JSON.stringify(data, null, indent);
            await $.self.mkdirp({ filepath });
            await $.fsp.writeFile(filepath, json);
        } catch (err) {
            err.data = { filepath };
            throw err;
        }
    };
};
