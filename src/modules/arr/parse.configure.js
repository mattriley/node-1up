module.exports = $ => config => {

    const parseOptions = $.fun.parseConfig($.defaults.array, config);

    return (val, ...options) => {
        const { delimiter } = parseOptions(options);

        if (val == null) {
            return []; // handles null and undefined
        }

        if (Array.isArray(val)) {
            return val;
        }

        const s = String(val).trim();
        if (!s) return [];

        // Split, trim, drop empties in one pass
        const parts = s.split(delimiter);
        const out = [];
        for (let i = 0; i < parts.length; i++) {
            const token = parts[i].trim();
            if (token) out.push(token);
        }
        return out;
    };
};
