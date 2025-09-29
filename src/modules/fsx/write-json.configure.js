module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.json, config);

    return async (filepath, data, options) => {
        options = parseOptions(options);

        try {
            const json = JSON.stringify(data, null, options.indent);
            await $.self.mkdirp({ filepath });
            await $.fsp.writeFile(filepath, json);
        } catch (err) {
            err.data = { filepath };
            throw err;
        }
    };
};
