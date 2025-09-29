module.exports = $ => config => {
    const parseOptions = $.fun.parseConfig($.defaults.array, config);

    return (val, delimiter) => {
        ({ delimiter } = parseOptions({ delimiter }));

        if (val == null) return [];
        if (Array.isArray(val)) return val;

        const s = String(val).trim();
        if (!s) return [];

        const parts = s.split(delimiter);
        const out = [];
        for (let i = 0; i < parts.length; i++) {
            const token = parts[i].trim();
            if (token) out.push(token);
        }
        return out;
    };
};
