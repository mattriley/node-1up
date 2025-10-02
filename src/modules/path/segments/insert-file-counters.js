// path/segments/insert-file-counters.js
const path = require('path');

module.exports = $ => files => {
    if (!files || files.length === 0) return files;

    const DELIM = $.config.path.delimiter;

    // Normalize a segment's value into tokens we can count over
    const tokensOf = seg => {
        const v = seg?.value;
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') return v.split(DELIM).filter(Boolean);
        return [String(v ?? '')];
    };

    // Render segments into a plain path string (like $.here.renderPath)
    const renderFromSegments = segments =>
        (Array.isArray(segments) ? segments : [])
            .flatMap(tokensOf)
            .join(DELIM);

    // Build entries with pre-rendered dir for each file
    const entries = files.map((file, idx) => {
        const segments = Array.isArray(file?.segments) ? file.segments : [];
        const rendered = renderFromSegments(segments);
        const { dir } = path.parse(rendered);
        return { idx, file, segments, dir };
    });

    // Count cumulative directory steps across all files
    const counts = new Map();
    for (const { dir } of entries) {
        if (!dir) continue;
        const steps = $.path.steps(dir); // e.g. ['a', 'a/b', 'a/b/c']
        for (const step of steps) {
            counts.set(step, (counts.get(step) || 0) + 1);
        }
    }

    const shouldDecorate = seg => seg?.fileCounters !== false;

    // Decorate directory tokens; keep filename tokens untouched.
    // Always return string values for segments.
    const out = files.slice();

    for (const { idx, file, segments, dir } of entries) {
        // No directories → preserve identity
        if (!dir || segments.length === 0) continue;

        const dirSteps = $.path.steps(dir);
        const dirCount = dirSteps.length;

        const nextSegs = new Array(segments.length);
        let acc = '';
        let seen = 0;
        let changed = false;

        for (let s = 0; s < segments.length; s++) {
            const seg = segments[s];
            const toks = tokensOf(seg);

            const mapped = new Array(toks.length);
            for (let t = 0; t < toks.length; t++) {
                const tok = toks[t];

                if (seen < dirCount) {
                    // This token is part of directories: always advance cumulative,
                    // only decorate if segment allows it.
                    acc = acc ? path.join(acc, tok) : tok;
                    const c = counts.get(acc) || 0;
                    const outTok = shouldDecorate(seg) ? `${tok} (${c})` : tok;
                    mapped[t] = outTok;
                    seen += 1;
                } else {
                    // Filename (or tokens beyond dirCount): never decorate
                    mapped[t] = tok;
                }
            }

            const newValue = mapped.join(DELIM);
            if (newValue !== (seg.value ?? '')) {
                changed = true;
                nextSegs[s] = { ...seg, value: newValue };
            } else {
                nextSegs[s] = seg;
            }
        }

        if (changed) {
            out[idx] = { ...file, segments: nextSegs };
        }
    }

    return out;
};
