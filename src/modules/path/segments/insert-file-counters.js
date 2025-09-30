// path/segments/insert-file-counters.js
const path = require('path');

module.exports = $ => files => {
    if (!files || files.length === 0) return files;

    // Render once; count cumulative dir steps across all files
    const entries = files.map(segments => {
        // Mirror $.here.renderPath for segments without depending on $
        const rendered = segments
            .flatMap(s => Array.isArray(s.value) ? s.value : [s.value])
            .join($.config.path.delimiter);
        const { dir } = path.parse(rendered);
        return { segments, dir };
    });

    const counts = new Map();
    for (const { dir } of entries) {
        if (!dir) continue;
        const steps = $.path.steps(dir); // e.g., ['a', 'a/b', 'a/b/c']
        for (const step of steps) counts.set(step, (counts.get(step) || 0) + 1);
    }

    const shouldDecorate = seg => seg.fileCounters !== false;

    // Decorate directory segments; preserve scalar/array shape for .value
    return entries.map(({ segments, dir }) => {
        if (!dir) return segments;

        const dirSteps = $.path.steps(dir);
        const dirCount = dirSteps.length;

        const out = [];
        let acc = '';
        let seen = 0;

        for (const seg of segments) {
            const wasArray = Array.isArray(seg.value);
            const values = wasArray ? seg.value : [seg.value];

            const mapped = values.map(v => {
                if (seen < dirCount) {
                    // advance cumulative path and count, regardless of decoration
                    acc = acc ? path.join(acc, v) : v;
                    const c = counts.get(acc) || 0;
                    seen += 1;

                    // Only render the "(n)" if this segment allows it
                    return shouldDecorate(seg) ? `${v} (${c})` : v;
                }
                return v; // filename piece stays as-is
            });

            out.push({ ...seg, value: wasArray ? mapped : mapped[0] });
        }

        return out;
    });
};
