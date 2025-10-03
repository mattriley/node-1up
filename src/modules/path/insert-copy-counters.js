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
        const segs = Array.isArray(files[i]?.segments) ? files[i].segments : [];
        const k = keyOf(segs);
        (groups[k] || (groups[k] = [])).push(i);
    }

    // Copy-on-write result (preserve file identity if unchanged)
    const out = files.slice();

    // Append .<n> to the last segment for groups with duplicates
    for (const k in groups) {
        const idxs = groups[k];
        if (!idxs || idxs.length <= 1) continue;

        for (let g = 0; g < idxs.length; g++) {
            const i = idxs[g];
            const file = files[i];
            const segs = Array.isArray(file?.segments) ? file.segments : [];
            if (!segs.length) continue;

            const lastIx = segs.length - 1;
            const { last, baseKey, hasNumeric } = parseLast(segs);

            // If it already ends with ".digits", skip modifying (no double-add)
            if (hasNumeric) continue;

            // Compose the new full name from the normalized baseKey (trims whitespace)
            const newFull = `${baseKey}.${g + 1}`;

            // Compute new suffix so that (value + suffix) === newFull
            const valuePart = last.value ?? '';
            const nextSuffix = newFull.slice(valuePart.length); // works even if value==''

            // Clone segments array; replace only the last segment object
            const nextSegments = segs.slice();
            nextSegments[lastIx] = { ...last, suffix: nextSuffix };

            // Replace the file with a shallow copy that has updated segments
            out[i] = { ...file, segments: nextSegments };
        }
    }

    return out;
};
