module.exports = $ => config => {
    const defaults = { mutate: false, equal: Object.is };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (arr, options) => {
        options = parseOptions(options);

        const n = arr.length;
        if (n <= 1) return options.mutate ? arr : arr.slice(); // preserve current contract

        if (options.mutate) {
            // In-place write: keep arr[0], then copy only when not equal to previous kept
            let write = 1;
            let prev = arr[0];
            for (let read = 1; read < n; read++) {
                const v = arr[read];
                if (!options.equal(v, prev)) {
                    arr[write++] = v;
                    prev = v;
                }
            }
            arr.length = write; // truncate tail
            return arr;
        }

        // Immutable: build a new compacted array in one pass
        const out = new Array(n); // upper bound; we'll set length at the end
        let write = 0;
        let prev = arr[0];
        out[write++] = prev;
        for (let i = 1; i < n; i++) {
            const v = arr[i];
            if (!options.equal(v, prev)) {
                out[write++] = v;
                prev = v;
            }
        }
        out.length = write; // trim unused slots
        return out;
    };
};
