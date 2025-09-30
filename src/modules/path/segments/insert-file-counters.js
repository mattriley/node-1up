// path/segments/insert-file-counters.js
const path = require('path');

module.exports = $ => files => {
    if (!files || files.length === 0) return files;

    const DELIM = $.config.path.delimiter;

    // Normalise a segment's value into an array of tokens for counting
    const tokensOf = seg => {
        const v = seg.value;
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') return v.split(DELIM).filter(Boolean);
        return [String(v)];
    };

    // Render segments into a plain path string (like $.here.renderPath)
    const renderFromSegments = segments =>
        segments.flatMap(tokensOf).join(DELIM);

    // 1) Render & parse once per file to get directory portion
    const entries = files.map(segments => {
        const rendered = renderFromSegments(segments);
        const { dir } = path.parse(rendered);
        return { segments, dir };
    });

    // 2) Count cumulative directory steps across all files
    const counts = new Map();
    for (const { dir } of entries) {
        if (!dir) continue;
        const steps = $.path.steps(dir); // e.g. ['a', 'a/b', 'a/b/c']
        for (const step of steps) counts.set(step, (counts.get(step) || 0) + 1);
    }

    const shouldDecorate = seg => seg.fileCounters !== false;

    // 3) Decorate directory tokens; always return string values for segments
    return entries.map(({ segments, dir }) => {
        if (!dir) return segments; // keep identity when no directories

        const dirSteps = $.path.steps(dir);
        const dirCount = dirSteps.length;

        const out = [];
        let acc = '';
        let seen = 0;

        for (const seg of segments) {
            const toks = tokensOf(seg);

            const mapped = toks.map(t => {
                if (seen < dirCount) {
                    acc = acc ? path.join(acc, t) : t;
                    const c = counts.get(acc) || 0;
                    seen += 1;
                    return shouldDecorate(seg) ? `${t} (${c})` : t;
                }
                return t; // filename part remains unchanged
            });

            // ALWAYS return segment.value as a single string path
            out.push({ ...seg, value: mapped.join(DELIM) });
        }

        return out;
    });
};
