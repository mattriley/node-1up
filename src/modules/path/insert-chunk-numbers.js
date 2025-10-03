// path/segments/insert-chunk-numbers.js
module.exports = $ => (files, options = {}) => {
    if (!files || files.length === 0) return files;

    const { chunkSize } = options;
    const DELIM = $.config.path.delimiter;

    // Tokenize all segments' values into a single list of path tokens
    const tokensOf = seg => {
        const v = seg?.value;
        if (Array.isArray(v)) return v;
        if (typeof v === 'string') return v.split(DELIM).filter(Boolean);
        return [String(v ?? '')];
    };

    const getSegs = f => (Array.isArray(f?.segments) ? f.segments : []);

    // Return directory key (all tokens except the last, joined by DELIM)
    const dirKeyOf = f => {
        const segs = getSegs(f);
        if (segs.length === 0) return ''; // no path
        const all = segs.flatMap(tokensOf);
        if (all.length <= 1) return '';   // no directory
        return all.slice(0, -1).join(DELIM);
    };

    // Simple chunker (no lodash)
    const chunkIndices = (idxs, size) => {
        const out = [];
        for (let i = 0; i < idxs.length; i += size) {
            out.push(idxs.slice(i, i + size));
        }
        return out;
    };

    // If chunkSize is not a positive finite number, do nothing
    if (!Number.isFinite(chunkSize) || chunkSize <= 0) return files;

    // Group file indices by directory key (stable order)
    const byDir = Object.create(null);
    for (let i = 0; i < files.length; i++) {
        const k = dirKeyOf(files[i]);
        (byDir[k] || (byDir[k] = [])).push(i);
    }

    // Prepare output (copy outer array only)
    const out = files.slice();

    // For each directory group, chunk and insert the chunk number before the last segment
    for (const k in byDir) {
        const idxs = byDir[k];
        if (!idxs || idxs.length === 0) continue;

        const chunks = chunkIndices(idxs, chunkSize);
        if (chunks.length <= 1) continue; // nothing to do

        // Zero-pad according to number of chunks
        const fmt = n => $.str.padZero(n, chunks.length);

        for (let ci = 0; ci < chunks.length; ci++) {
            const chunkNum = fmt(ci + 1);

            const thisChunk = chunks[ci];
            for (let j = 0; j < thisChunk.length; j++) {
                const fi = thisChunk[j];
                const file = files[fi];
                const segs = getSegs(file);
                if (segs.length === 0) continue; // skip degenerate

                const lastIx = segs.length - 1;
                const nextSegs = segs.slice(0, lastIx)
                    .concat({ value: chunkNum }, segs.slice(lastIx));

                out[fi] = { ...file, segments: nextSegs };
            }
        }
    }

    return out;
};
