// path/segments/append-copy-counters.js
module.exports = $ => files => {
    if (!files || files.length === 0) return files;

    const DELIM = $.config.path.delimiter;

    // value + suffix, trimmed
    const segText = seg => `${seg?.value ?? ''}${seg?.suffix ?? ''}`.trim();

    // dirname render (all but last), using your delimiter
    const renderDir = segments => {
        if (!segments || segments.length <= 1) return '';
        const parts = new Array(segments.length - 1);
        for (let i = 0; i < segments.length - 1; i++) parts[i] = segText(segments[i]);
        return parts.filter(Boolean).join(DELIM);
    };

    // last segment text, trimmed; plus a "baseKey" with trailing ".digits" stripped
    const parseLast = segments => {
        const last = segments[segments.length - 1] || {};
        const full = segText(last);                 // e.g., "file" or "file.7"
        const baseKey = full.replace(/\.\d+$/, ''); // normalize for grouping
        const hasNumeric = /\.\d+$/.test(full);     // already has a counter
        return { last, full, baseKey, hasNumeric };
    };

    // Group by dir + normalized basename (no numeric suffix)
    const keyOf = segments => {
        if (!segments || segments.length === 0) return '|';
        const dir = renderDir(segments);
        const { baseKey } = parseLast(segments);
        return `${dir}|${baseKey}`;
    };

    // Build groups (preserve stable order)
    const groups = Object.create(null);
    for (let i = 0; i < files.length; i++) {
        const segments = files[i] || [];
        const k = keyOf(segments);
        (groups[k] || (groups[k] = [])).push(i);
    }

    // Copy-on-write result
    const out = files.slice();

    // Append .<n> to the last segment for groups with duplicates
    for (const k in groups) {
        const idxs = groups[k];
        if (!idxs || idxs.length <= 1) continue;

        for (let g = 0; g < idxs.length; g++) {
            const i = idxs[g];
            const segments = files[i] || [];
            if (!segments.length) continue;

            const lastIx = segments.length - 1;
            const { last, full, baseKey, hasNumeric } = parseLast(segments);

            // If it already ends with ".digits", skip modifying (no double-add)
            if (hasNumeric) continue;

            // Compose the new full name from the normalized baseKey (trims whitespace)
            const newFull = `${baseKey}.${g + 1}`;

            // Compute new suffix so that (value + suffix) === newFull
            const valuePart = last.value ?? '';
            const nextSuffix = newFull.slice(valuePart.length); // works even if value==''

            // Clone segments array; replace only the last segment object
            const nextSegments = segments.slice();
            nextSegments[lastIx] = { ...last, suffix: nextSuffix };

            out[i] = nextSegments;
        }
    }

    return out;
};
