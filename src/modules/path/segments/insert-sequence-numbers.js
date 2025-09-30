// path/segments/insert-sequence-numbers.js
const path = require('path');

module.exports = $ => (files, options = {}) => {
    if (!files || files.length === 0) return files;

    const { mono = false } = options;
    const DELIM = $.config.path.delimiter;

    const tokensOf = seg => {
        const v = seg.value;
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') return v.split(DELIM).filter(Boolean);
        return [String(v)];
    };

    const renderPath = segments =>
        segments.flatMap(tokensOf).join(DELIM);

    const buildStepIndex = files => {
        const index = Object.create(null);
        for (let i = 0; i < files.length; i++) {
            const rendered = renderPath(files[i]);
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

    return files.map(segments => {
        const rendered = renderPath(segments);
        if (!rendered) return segments;

        // Special-case: single segment, single token — decorate in-place to preserve array identity
        if (segments.length === 1) {
            const seg0 = segments[0];
            const toks0 = tokensOf(seg0);
            if (toks0.length === 1) {
                const tok = toks0[0];
                const idx = stepIndex[tok] ?? 0; // cumulative is just the token itself
                const allow = seg0.sequenceNumbers !== false;
                const decorated = allow ? `${formatPrefix(idx)} ${tok}` : tok;
                // mutate the existing array element (preserve array identity)
                segments[0] = { ...seg0, value: decorated };
                return segments;
            }
        }

        // General case: return a new array with decorated segment values
        const out = new Array(segments.length);
        let cumulative = '';

        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const allowPrefix = seg.sequenceNumbers !== false;

            const tokens = tokensOf(seg);
            const mapped = new Array(tokens.length);

            for (let t = 0; t < tokens.length; t++) {
                const tok = tokens[t];
                cumulative = cumulative ? path.join(cumulative, tok) : tok;
                const idx = stepIndex[cumulative] ?? 0;
                mapped[t] = allowPrefix ? `${formatPrefix(idx)} ${tok}` : tok;
            }

            out[i] = { ...seg, value: mapped.join(DELIM) };
        }

        return out;
    });
};
