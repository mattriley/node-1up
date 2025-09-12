module.exports = ({ fun, globalConfig }) => config => {

    const parseOptions = fun.parseConfig(globalConfig.path, config);

    return (paths, ...options) => {
        const { delimiter } = parseOptions(options);
        const result = {};

        for (const path of new Set(paths)) {
            const trimmed = path.replace(new RegExp(`${delimiter}+$`), '');
            if (!trimmed) continue;

            const segments = trimmed.split(delimiter);
            let current = result;

            for (const segment of segments) {
                current = current[segment] ??= {};
            }
        }

        return result;
    };
};
