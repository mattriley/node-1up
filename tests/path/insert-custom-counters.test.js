// tests/path/insert-custom-counters.test.js
module.exports = ({ test, assert }) => $ => {

    const run = $.path.insertCustomCounters;
    const DELIM = $.config.path.delimiter;

    // Helpers
    // Accepts either strings or pre-formed segment objects and normalizes to segments
    const segs = (...parts) =>
        parts.map(p => (typeof p === 'string' ? { value: p } : p));

    const file = (segments, metadata = {}) => ({ segments, metadata });

    // Render: value + suffix, joined by delimiter
    const render = f =>
        (f.segments || [])
            .map(s => `${s.value}${s.suffix ?? ''}`)
            .join(DELIM);

    // ─────────────────────────────────────────────────────────────────────────────
    // BASIC
    // ─────────────────────────────────────────────────────────────────────────────

    test('basic: indicators derive from counters on each segment', () => {
        const a1 = segs(
            { value: 'a', counters: [{ key: 'star', true: '★' /* no false */ }] },
            { value: 'b', counters: [{ key: 'star', true: '★' /* no false */ }] },
            { value: 'x.txt', counters: [{ key: 'star', true: '★' /* no false */ }] }
        );
        const a2 = segs(
            { value: 'a', counters: [{ key: 'star', true: '★' /* no false */ }] },
            { value: 'c', counters: [{ key: 'star', true: '★' /* no false */ }] },
            { value: 'y.txt', counters: [{ key: 'star', true: '★' /* no false */ }] }
        );

        const files = [
            file(a1, { star: 1 }), // truthy
            file(a2, { star: 0 })  // falsy
        ];

        const out = run(files);

        // Step "a" is shared and true (from file 1) -> both show ★ at that step.
        // For file 2, 'c' and 'y.txt' are falsey and have no false display -> nothing shown.
        assert.equal(render(out[0]), 'a ★/b ★/x.txt ★');
        assert.equal(render(out[1]), 'a ★/c/y.txt');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // MULTIPLE COUNTERS
    // ─────────────────────────────────────────────────────────────────────────────

    test('multiple counters: intermediate segments space-join, last segment concatenates', () => {
        const s1 = segs(
            { value: 'p', counters: [{ key: 'star', true: '★', false: '☆' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'q', counters: [{ key: 'star', true: '★', false: '☆' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'file.txt', counters: [{ key: 'star', true: '★', false: '☆' }, { key: 'geo', true: '◉', false: '' }] }
        );
        const s2 = segs(
            { value: 'p', counters: [{ key: 'star', true: '★', false: '☆' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'r', counters: [{ key: 'star', true: '★', false: '☆' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'other.txt', counters: [{ key: 'star', true: '★', false: '☆' }, { key: 'geo', true: '◉', false: '' }] }
        );

        const out = run([
            file(s1, { star: 1, geo: 1 }),
            file(s2, { star: 1, geo: 0 }),
        ]);

        // Step 'p' has geo true (from file 1) and star true (both) → both files show "★ ◉" at 'p'
        // At 'q' (file 1) → geo true from file 1 → "★ ◉"
        // At 'r' (file 2) → geo is 0 for file 2 and file 1 isn't in this step → "★"
        // Last step: file 1 filename shows ★◉; file 2 filename shows only ★ (not ◉), since no file with 'other.txt' has geo=true
        assert.equal(render(out[0]), 'p ★ ◉/q ★ ◉/file.txt ★◉');
        assert.equal(render(out[1]), 'p ★ ◉/r ★/other.txt ★');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // DOT-PATH KEYS
    // ─────────────────────────────────────────────────────────────────────────────

    test('dot-path keys supported', () => {
        const s1 = segs(
            { value: 'a', counters: [{ key: 'flags.star', true: '★', false: '' }] },
            { value: 'b', counters: [{ key: 'flags.star', true: '★', false: '' }] },
            { value: 'x.txt', counters: [{ key: 'flags.star', true: '★', false: '' }] }
        );
        const s2 = segs(
            { value: 'a', counters: [{ key: 'flags.star', true: '★', false: '' }] },
            { value: 'c', counters: [{ key: 'flags.star', true: '★', false: '' }] },
            { value: 'y.txt', counters: [{ key: 'flags.star', true: '★', false: '' }] }
        );

        const out = run([
            file(s1, { flags: { star: true } }),
            file(s2, { flags: { star: false } }),
        ]);

        // Only file 1 contributes truthy; filename 'y.txt' is not shared → no star on file 2 filename
        assert.equal(render(out[0]), 'a ★/b ★/x.txt ★');
        assert.equal(render(out[1]), 'a ★/c/y.txt');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // COPY-ON-WRITE
    // ─────────────────────────────────────────────────────────────────────────────

    test('copy-on-write: unchanged files keep identity; changed files cloned', () => {
        const f1 = file(segs('x', '1.txt')); // no counters -> unchanged (identity preserved)

        const f2 = file(segs(
            { value: 'x', counters: [{ key: 'on', true: '✓', false: '' }] },
            { value: '2.txt', counters: [{ key: 'on', true: '✓', false: '' }] }
        ), { on: 0 });

        const f3 = file(segs(
            { value: 'x', counters: [{ key: 'on', true: '✓', false: '' }] },
            { value: '3.txt', counters: [{ key: 'on', true: '✓', false: '' }] }
        ), { on: 1 });

        const src = [f1, f2, f3];
        const out = run(src);

        // f1 had no counters -> identity preserved
        assert.strictEqual(out[0], f1);

        // The directory step 'x' has on=true because of f3 -> f2's 'x' segment now gets a ✓, so f2 is cloned.
        assert.notStrictEqual(out[1], f2);
        assert.notStrictEqual(out[2], f3);

        // Note: filename steps differ ('2.txt' vs '3.txt') so only f3’s filename shows ✓.
        assert.equal(render(out[1]), 'x ✓/2.txt');
        assert.equal(render(out[2]), 'x ✓/3.txt ✓');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // LAST-SEGMENT CONCATENATION
    // ─────────────────────────────────────────────────────────────────────────────

    test('last segment concatenates multiple indicators without spaces', () => {
        const seg = v => ({
            value: v,
            counters: [
                { key: 'a', true: 'A', false: '' },
                { key: 'b', true: 'B', false: '' },
                { key: 'c', true: 'C', false: '' }
            ]
        });

        const out = run([
            file([seg('root'), seg('name.txt')], { a: 1, b: 1, c: 1 }),
            file([seg('root'), seg('other.txt')], { a: 0, b: 1, c: 0 }),
        ]);

        // 'root' step shows "A B C" on both (due to file 1).
        // 'name.txt' step shows 'ABC' (file 1 truthy).
        // 'other.txt' is only present in file 2 with a,b,c = 0/1/0 -> only 'B'.
        assert.equal(render(out[0]), 'root A B C/name.txt ABC');
        assert.equal(render(out[1]), 'root A B C/other.txt B');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // OMIT EMPTY FALSE DISPLAYS
    // ─────────────────────────────────────────────────────────────────────────────

    test('false/empty displays are omitted cleanly', () => {
        const seg = v => ({
            value: v,
            counters: [{ key: 'hot', true: '🔥' }, { key: 'tag', true: '🏷', false: '' }]
        });

        const out = run([
            file([seg('a'), seg('file.txt')], { hot: 0, tag: 0 }),
            file([seg('a'), seg('file2.txt')], { hot: 1, tag: 0 }),
        ]);

        // Step 'a' has at least one hot=true (file 2) -> both show 🔥 at directory.
        // Filenames differ, so only file2's filename shows 🔥.
        assert.equal(render(out[0]), 'a 🔥/file.txt');
        assert.equal(render(out[1]), 'a 🔥/file2.txt 🔥');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // ATOMIC SEGMENT VALUES
    // ─────────────────────────────────────────────────────────────────────────────

    test('path-string segment remains atomic (no token-splitting inside a segment value)', () => {
        const seg = v => ({ value: v, counters: [{ key: 'flag', true: '✓', false: '' }] });

        const out = run([
            file([seg('a/b'), seg('x.txt')], { flag: 1 }),
            file([seg('a/b'), seg('y.txt')], { flag: 0 }),
        ]);

        // The step is 'a/b' as a single segment; both share it and one is truthy -> ✓ at directory step.
        // Filenames differ; only x.txt shows ✓ at filename.
        assert.equal(render(out[0]), 'a/b ✓/x.txt ✓');
        assert.equal(render(out[1]), 'a/b ✓/y.txt');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // DEGENERATE CASES
    // ─────────────────────────────────────────────────────────────────────────────

    test('degenerate: empty segments arrays are left unchanged', () => {
        const f1 = { segments: [] };
        const f2 = { segments: [] };
        const out = run([f1, f2]);

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
        assert.equal(render(out[0]), '');
        assert.equal(render(out[1]), '');
    });

    test('no indicators on any segment => identity preserved', () => {
        const f = file(segs('dir', 'file.txt')); // no counters anywhere
        const out = run([f]);

        assert.strictEqual(out[0], f);
        assert.equal(render(out[0]), 'dir/file.txt');
    });
};
