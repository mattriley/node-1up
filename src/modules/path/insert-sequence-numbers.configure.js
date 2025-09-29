const path = require('path');

module.exports = $ => config => {
    const defaults = {
        destKey: undefined,
        sortPrefixScope: 'all',
        enabledKey: 'sortPrefix',
        valueKey: 'value',
        mono: false,
    };

    const parseOptions = $.fun.parseConfig(defaults, config);
    const SEP = path.sep;

    // Format the numeric prefix once we know max file count
    const makeFormatter = (mono, maxVal) => {
        return val => {
            const s = $.str.padZero(val, maxVal);
            return mono ? $.str.mono(s) : s;
        };
    };

    // Build map of earliest index (1-based) for each cumulative path step
    const buildStepIndex = (files, sourceKey) => {
        return files.reduce((acc, f, i) => {
            const sortValue = i + 1; // assumes files are already in order
            const steps = $.path.steps(f[sourceKey]);
            for (let k = 0; k < steps.length; k++) {
                const step = steps[k];
                const existing = acc[step];
                acc[step] = existing ? Math.min(existing, sortValue) : sortValue;
            }
            return acc;
        }, Object.create(null));
    };

    // Normalise a sourcePath into [{[valueKey]: 'seg'}, ...]
    const toSegments = (sourcePath, valueKey) => {
        if (typeof sourcePath === 'string') {
            // Drop empty parts so trailing slash doesn’t produce a blank segment
            const parts = sourcePath.split(SEP);
            const out = [];
            for (let i = 0; i < parts.length; i++) {
                const p = parts[i];
                if (p.length > 0) out.push({ [valueKey]: p });
            }
            return out;
        }
        // Assume pre-tokenised [{ valueKey, ... }] form
        return sourcePath;
    };

    return (files, sourceKey, options) => {
        const { destKey = sourceKey, sortPrefixScope, valueKey, enabledKey, mono } =
            parseOptions(options);

        if (sortPrefixScope === 'none' || files.length === 0) return files;

        const maxPrefixVal = files.length;
        const formatPrefixValue = makeFormatter(mono, maxPrefixVal);
        const stepIndex = buildStepIndex(files, sourceKey);

        return files.map(f => {
            const src = f[sourceKey];
            const segs = toSegments(src, valueKey);

            // Rebuild with prefixes; compute cumulative step as we go
            let cumulative = '';
            const out = new Array(segs.length);

            for (let i = 0; i < segs.length; i++) {
                const seg = segs[i];
                const val = seg[valueKey];

                if (seg[enabledKey] === false) {
                    // Do NOT advance cumulative when disabled; keep behaviour
                    out[i] = val;
                    continue;
                }

                cumulative = cumulative ? (cumulative + SEP + val) : val;

                const stepVal = stepIndex[cumulative];
                const prefix = formatPrefixValue(stepVal ?? 0);

                out[i] = `${prefix} ${val}`;
            }

            const destPath = out.join(SEP);
            return { ...f, [destKey]: destPath };
        });
    };
};
