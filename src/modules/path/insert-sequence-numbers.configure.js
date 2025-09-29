const path = require('path');

module.exports = $ => config => {

    const defaults = { destKey: undefined, sortPrefixScope: 'all', mono: false };
    const parseOptions = $.fun.parseConfig(defaults, config);

    return (files, sourceKey, ...options) => {
        const { destKey = sourceKey, sortPrefixScope, mono } = parseOptions(options);

        if (sortPrefixScope === 'none') return files;

        const maxPrefixVal = files.length;

        const formatPrefixValue = val => {
            const sequenceNumber = $.str.padZero(val, maxPrefixVal);
            return mono ? $.str.mono(sequenceNumber) : sequenceNumber;
        };

        // Build a map from each cumulative path step to the earliest (1-based) index it appears at.
        const sortPrefixByPath = files.reduce((acc, f, i) => {
            const sortValue = i + 1; // assumes files are already in order
            const pathSteps = $.path.steps(f[sourceKey]); // cumulative steps, e.g. ['a', 'a/b', 'a/b/c.txt']

            return pathSteps.reduce((inner, step) => {
                const current = inner[step];
                const nextVal = current ? _.min([current, sortValue]) : sortValue;
                if (nextVal !== current) inner[step] = nextVal;
                return inner;
            }, acc);
        }, {});

        return files.map(f => {
            const sourcePath = f[sourceKey];

            let segments;

            if (typeof sourcePath === 'string') {
                segments = sourcePath.split(path.sep).filter(s => s.length > 0 || sourcePath.endsWith(path.sep)).map(value => ({ value }))
            } else {
                segments = sourcePath;
            }


            // Rebuild path by prefixing each segment with the formatted value for its cumulative step.
            // We compute cumulative keys as we walk the segments.

            let cumulative = '';
            const prefixedSegments = segments.map(seg => {
                // Maintain cumulative step using the platform separator
                cumulative = cumulative ? cumulative + path.sep + seg.value : seg.value;

                const stepVal = sortPrefixByPath[cumulative];
                // If somehow missing, fall back to 0 (still formatted consistently)
                const prefix = formatPrefixValue(stepVal ?? 0);

                // Use a single space as separator between prefix and the original segment for readability
                return `${prefix} ${seg.value}`;
            });

            // Preserve leading slash if present; preserve trailing slash if present
            const destPath = prefixedSegments.join(path.sep);;

            // let destPath = (sourcePath.startsWith(path.sep) ? path.sep : '') + prefixedSegments.join(path.sep);
            // if (sourcePath.endsWith(path.sep) && !destPath.endsWith(path.sep)) destPath += path.sep;

            return { ...f, [destKey]: destPath };
        });
    };
};
