module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.path, config);

    return (paths, options) => {
        options = parseOptions(options);
        const result = {};

        for (const path of new Set(paths)) {
            const trimmed = path.replace(new RegExp(`${options.delimiter}+$`), '');
            if (!trimmed) continue;

            const segments = trimmed.split(options.delimiter);
            let current = result;

            for (const segment of segments) {
                current = current[segment] ??= {};
            }
        }

        return result;
    };
};
