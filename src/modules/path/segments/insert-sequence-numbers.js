// path/segments/insert-sequence-numbers.js
const path = require('path');

module.exports = $ => (files, options = {}) => {
    if (!files || files.length === 0) return files;

    const { mono = false } = options;
    const DELIM = $.config.path.delimiter;

    // Tokenize a segment.value into tokens
    const tokensOf = seg => {
        const v = seg?.value;
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') return v.split(DELIM).filter(Boolean);
        return [String(v ?? '')];
    };

    // Render a file's path from its segments (like $.here.renderPath)
    const renderPath = segments =>
        (Array.isArray(segments) ? segments : [])
            .flatMap(tokensOf)
            .join(DELIM);

    // Build earliest 1-based index for each cumulative path step across all files
    const buildStepIndex = fileList => {
        const index = Object.create(null);
        for (let i = 0; i < fileList.length; i++) {
            const segs = Array.isArray(fileList[i]?.segments) ? fileList[i].segments : [];
            const rendered = renderPath(segs);
            const steps = $.path.steps(rendered); // includes filename step
            const sortValue = i + 1;
            for (let k = 0; k < steps.length; k++) {
                const step = steps[k];
                const existing = index[step];
                index[step] = existing
                    ? (existing < sortValue ? existing : sortValue)
                    : sortValue;
            }
        }
        return index;
    };

    const makeFormatter = (monoFlag, maxVal) => val => {
        const s = $.str.padZero(val, maxVal);
        return monoFlag ? $.str.mono(s) : s;
    };

    const stepIndex = buildStepIndex(files);
    const formatPrefix = makeFormatter(mono, files.length);

    // Output list (copy outer array)
    const out = files.slice();

    for (let fi = 0; fi < files.length; fi++) {
        const file = files[fi];
        const segments = Array.isArray(file?.segments) ? file.segments : [];
        const rendered = renderPath(segments);
        if (!rendered) continue;

        // Special-case: single segment, single token — decorate in-place to preserve file identity
        if (segments.length === 1) {
            const seg0 = segments[0];
            const toks0 = tokensOf(seg0);
            if (toks0.length === 1) {
                const tok = toks0[0];
                const idx = stepIndex[tok] ?? 0; // cumulative is just the token itself
                const allow = seg0.sequenceNumbers !== false;
                const decorated = allow ? `${formatPrefix(idx)} ${tok}` : tok;
                // mutate the existing segment object; preserves file identity
                segments[0] = { ...seg0, value: decorated };
                out[fi] = file; // same reference
                continue;
            }
        }

        // General case: copy-on-write, compute decorated string values
        let cumulative = '';
        let changed = false;
        const nextSegs = new Array(segments.length);

        for (let si = 0; si < segments.length; si++) {
            const seg = segments[si];
            const allowPrefix = seg?.sequenceNumbers !== false;

            const tokens = tokensOf(seg);
            const mapped = new Array(tokens.length);

            for (let t = 0; t < tokens.length; t++) {
                const tok = tokens[t];
                cumulative = cumulative ? path.join(cumulative, tok) : tok;
                const idx = stepIndex[cumulative] ?? 0;
                mapped[t] = allowPrefix ? `${formatPrefix(idx)} ${tok}` : tok;
            }

            const newValue = mapped.join(DELIM);
            if (newValue !== (seg.value ?? '')) {
                changed = true;
                nextSegs[si] = { ...seg, value: newValue };
            } else {
                nextSegs[si] = seg;
            }
        }

        if (changed) {
            out[fi] = { ...file, segments: nextSegs };
        }
    }

    return out;
};
