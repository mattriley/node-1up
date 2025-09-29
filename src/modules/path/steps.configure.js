module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.path, config);

    return (pathname, delimiter) => {
        options = parseOptions({ delimiter });

        const parts = pathname.split(options.delimiter).filter(Boolean); // ignore empty parts
        const prefixes = [];
        let acc = '';

        for (const part of parts) {
            acc = acc ? acc + options.delimiter + part : part;
            prefixes.push(acc);
        }

        return prefixes;
    };
};
