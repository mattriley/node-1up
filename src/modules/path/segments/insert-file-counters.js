// path/segments/insert-file-counters.js
const path = require('path');

module.exports = $ => files => {
    if (!files || files.length === 0) return files;

    const DELIM = $.config.path.delimiter;

    // Tokenise a segment value into an array of parts (without decorating)
    const tokensOf = seg => {
        const v = seg.value;
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') return v.split(DELIM).filter(Boolean);
        return [String(v)];
    };

    // Build a rendered string (like $.here.renderPath) from segments
    const renderFromSegments = segments =>
        segments.flatMap(tokensOf).join(DELIM);

    // 1) Render once; extract dir for each file
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

    // 3) Decorate directory tokens, keep filename tokens as-is
    return entries.map(({ segments, dir }) => {
        if (!dir) return segments;

        const dirSteps = $.path.steps(dir);
        const dirCount = dirSteps.length;

        const out = [];
        let acc = '';
        let seen = 0;

        for (const seg of segments) {
            const original = seg.value;
            const toks = tokensOf(seg);

            const mapped = toks.map(t => {
                if (seen < dirCount) {
                    acc = acc ? path.join(acc, t) : t; // build cumulative path
                    const c = counts.get(acc) || 0;
                    seen += 1;
                    return shouldDecorate(seg) ? `${t} (${c})` : t;
                }
                return t; // filename part
            });

            // Preserve shape:
            // - if original was array -> keep array
            // - if original was string:
            //     * 1 token -> return string
            //     * >1 tokens -> return array (because we split it)
            // - else -> single string
            const nextValue = Array.isArray(original)
                ? mapped
                : (typeof original === 'string'
                    ? (mapped.length === 1 ? mapped[0] : mapped)
                    : mapped[0]);

            out.push({ ...seg, value: nextValue });
        }

        return out;
    });
};
