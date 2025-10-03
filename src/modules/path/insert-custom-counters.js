// path/segments/insert-custom-counters.js
module.exports = $ => (files, options = {}) => {
    if (!files || files.length === 0) return files;

    const { enabled = true } = options;
    if (!enabled) return files;

    const DELIM = $.config.path.delimiter;

    // --- helpers -------------------------------------------------------------

    const getSegs = f => (Array.isArray(f?.segments) ? f.segments : []);
    const segValue = seg => (seg && typeof seg.value === 'string' ? seg.value : '');

    // cumulative steps from segment values (ignore suffixes)
    const cumulativeSteps = segments => {
        const vals = segments.map(segValue).filter(Boolean);
        const out = new Array(vals.length);
        let acc = '';
        for (let i = 0; i < vals.length; i++) {
            acc = acc ? acc + DELIM + vals[i] : vals[i];
            out[i] = acc;
        }
        return out;
    };

    // simple dot-path dig (e.g., "a.b.c")
    const dig = (obj, dotted) => {
        if (!obj || !dotted) return undefined;
        const parts = String(dotted).split('.');
        let cur = obj;
        for (let i = 0; i < parts.length; i++) {
            const k = parts[i];
            if (cur != null && Object.prototype.hasOwnProperty.call(cur, k)) {
                cur = cur[k];
            } else {
                return undefined;
            }
        }
        return cur;
    };

    const cloneFileIfNeeded = (original, newSegs) => {
        if (newSegs === original.segments) return original;
        return { ...original, segments: newSegs };
    };

    // --- pass 1: bucket file indices by cumulative step ----------------------

    const stepsByFile = new Array(files.length); // cache steps per file
    const filesByPathname = Object.create(null); // step -> [fileIndex]

    for (let i = 0; i < files.length; i++) {
        const segs = getSegs(files[i]);
        if (segs.length === 0) { stepsByFile[i] = []; continue; }
        const steps = cumulativeSteps(segs);
        stepsByFile[i] = steps;
        for (let s = 0; s < steps.length; s++) {
            const key = steps[s];
            (filesByPathname[key] || (filesByPathname[key] = [])).push(i);
        }
    }

    // --- pass 2: count per step per key (segment-level counters only) --------
    // For each step, we count keys that appear in the segment at that index.

    const countsByPathname = Object.create(null); // step -> { key: count }

    for (const step in filesByPathname) {
        const idxs = filesByPathname[step];
        const counts = Object.create(null);

        for (let p = 0; p < idxs.length; p++) {
            const fi = idxs[p];
            const f = files[fi];
            const segs = getSegs(f);
            const steps = stepsByFile[fi];
            if (!segs.length || !steps.length) continue;

            // Find which segment index corresponds to this step
            // (steps are cumulative; index aligns with segment index)
            const segIndex = steps.indexOf(step);
            if (segIndex < 0 || segIndex >= segs.length) continue;

            const seg = segs[segIndex];
            const segCounters = Array.isArray(seg?.counters) ? seg.counters : [];
            if (!segCounters.length) continue;

            for (let c = 0; c < segCounters.length; c++) {
                const key = segCounters[c].key;
                if (!key) continue;
                const val = dig(f.metadata, key);
                if (val) counts[key] = (counts[key] || 0) + 1;
            }
        }

        countsByPathname[step] = counts;
    }

    // --- pass 3: write suffixes per segment (copy-on-write) ------------------

    const out = files.slice();

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const segs = getSegs(f);
        if (segs.length === 0) continue;

        const steps = stepsByFile[i];
        if (!steps || !steps.length) continue;

        let changed = false;
        const nextSegs = new Array(segs.length);

        for (let idx = 0; idx < segs.length; idx++) {
            const seg = segs[idx] || {};
            const pathname = steps[idx];
            const isLast = idx === segs.length - 1;

            const segCounters = Array.isArray(seg.counters) ? seg.counters : [];
            if (!segCounters.length) {
                // no counters: preserve existing suffix unchanged
                nextSegs[idx] = seg;
                continue;
            }

            const stepCounts = countsByPathname[pathname] || Object.create(null);

            // Build indicator list in the order the segment lists counters
            const indicators = [];
            for (let c = 0; c < segCounters.length; c++) {
                const item = segCounters[c];
                const k = item.key;
                if (!k) continue;

                const count = stepCounts[k];
                const bool = !!count;
                const display = item[bool]; // expects item.true / item.false (strings; falsey omitted)
                if (!display) continue;
                indicators.push(display);
            }

            const joined = indicators.join(isLast ? '' : ' ').trim();
            const suffix = joined ? ` ${joined}` : '';

            const prevSuffix = seg.suffix || '';
            if (suffix !== prevSuffix) {
                changed = true;
                nextSegs[idx] = { ...seg, suffix };
            } else {
                nextSegs[idx] = seg;
            }
        }

        if (changed) out[i] = cloneFileIfNeeded(f, nextSegs);
    }

    return out;
};
