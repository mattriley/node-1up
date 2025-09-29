// insert-sequence-numbers.configure.js
module.exports = $ => config => {
    const defaults = {
        destKey: undefined,
        sortPrefixScope: 'all',
        enabledKey: 'sortPrefix',
        valueKey: 'value',
        mono: false,
        pathSep: $.globalConfig.path.delimiter
    };

    const parseOptions = $.fun.parseConfig(defaults, config);

    // Build map of earliest index (1-based) for each cumulative path step
    const buildStepIndex = (files, sourceKey) => {
        return files.reduce((acc, f, i) => {
            const sortValue = i + 1; // assumes files are already in order
            const steps = $.path.steps(f[sourceKey]);
            for (let k = 0; k < steps.length; k++) {
                const step = steps[k];
                const existing = acc[step];
                acc[step] = existing ? (existing < sortValue ? existing : sortValue) : sortValue; // Math.min without call
            }
            return acc;
        }, Object.create(null));
    };

    // Normalise a sourcePath into [{ [valueKey]: 'seg' }, ...]
    const toSegments = (sourcePath, valueKey, pathSep) => {
        if (typeof sourcePath !== 'string') return sourcePath; // already tokenised
        const parts = sourcePath.split(pathSep);
        const out = [];
        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            if (p.length > 0) out.push({ [valueKey]: p }); // drop empty (no trailing blank segment)
        }
        return out;
    };

    // Format the numeric prefix once we know max file count
    const makeFormatter = (mono, maxVal) => val => {
        const s = $.str.padZero(val, maxVal);
        return mono ? $.str.mono(s) : s;
    };

    return (files, sourceKey, options) => {
        const {
            destKey = sourceKey,
            sortPrefixScope,
            valueKey,
            enabledKey,
            mono,
            pathSep
        } = parseOptions(options);

        if (sortPrefixScope === 'none' || files.length === 0) return files;

        const formatPrefixValue = makeFormatter(mono, files.length);
        const stepIndex = buildStepIndex(files, sourceKey);

        return files.map(f => {
            const src = f[sourceKey];
            const segs = toSegments(src, valueKey, pathSep);

            // Rebuild with prefixes; compute cumulative step as we go
            let cumulative = '';
            const out = new Array(segs.length);

            for (let i = 0; i < segs.length; i++) {
                const seg = segs[i];
                const val = seg[valueKey];

                if (seg[enabledKey] === false) {
                    // Keep behaviour: do NOT advance cumulative when disabled
                    out[i] = val;
                    continue;
                }

                cumulative = cumulative ? (cumulative + pathSep + val) : val;

                const stepVal = stepIndex[cumulative];
                const prefix = formatPrefixValue(stepVal ?? 0);

                out[i] = `${prefix} ${val}`;
            }

            return { ...f, [destKey]: out.join(pathSep) };
        });
    };
};
