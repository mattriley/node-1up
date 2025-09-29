module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.path, config);

    return (pathname, delimiter = '/') => {
        console.warn(pathname, delimiter);
        // const { delimiter } = parseOptions(options);

        const parts = pathname.split(delimiter).filter(Boolean); // ignore empty parts
        const prefixes = [];
        let acc = '';

        for (const part of parts) {
            acc = acc ? acc + delimiter + part : part;
            prefixes.push(acc);
        }

        return prefixes;
    };
};
