// tests/path/insert-custom-counters.test.js
module.exports = ({ test, assert }) => $ => {

    const run = $.path.insertCustomCounters;
    const DELIM = $.config.path.delimiter;

    // Helpers
    // Accept strings or pre-built segment objects; normalize to { value, ... }
    const segs = (...parts) =>
        parts.map(p => (typeof p === 'string' ? { value: p } : p));

    const file = (segments, metadata = {}) => ({ segments, metadata });

    // Render value + suffix joined by delimiter (no file extensions anywhere)
    const render = f =>
        (f.segments || [])
            .map(s => `${s.value}${s.suffix ?? ''}`)
            .join(DELIM);

    // ─────────────────────────────────────────────────────────────────────────────
    // BASIC
    // ─────────────────────────────────────────────────────────────────────────────

    test('basic: indicators derive from counters on each segment (no extensions)', () => {
        const a1 = segs(
            { value: 'a', counters: [{ key: 'star', true: '★' }] },
            { value: 'b', counters: [{ key: 'star', true: '★' }] },
            { value: 'x', counters: [{ key: 'star', true: '★' }] }
        );
        const a2 = segs(
            { value: 'a', counters: [{ key: 'star', true: '★' }] },
            { value: 'c', counters: [{ key: 'star', true: '★' }] },
            { value: 'y', counters: [{ key: 'star', true: '★' }] }
        );

        const out = run([
            file(a1, { star: 1 }), // truthy
            file(a2, { star: 0 })  // falsy
        ]);

        // 'a' step shared & truthy → both show ★ at 'a'.
        // 'b'/'x' are truthy because file1 itself is truthy at those steps.
        // 'c'/'y' have no truthy file at those exact steps → no indicators.
        assert.equal(render(out[0]), 'a ★/b ★/x ★');
        assert.equal(render(out[1]), 'a ★/c/y');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // MULTIPLE COUNTERS
    // ─────────────────────────────────────────────────────────────────────────────

    test('multiple counters: intermediate space-join, last concatenates (no extensions)', () => {
        const s1 = segs(
            { value: 'p', counters: [{ key: 'star', true: '★' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'q', counters: [{ key: 'star', true: '★' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'file', counters: [{ key: 'star', true: '★' }, { key: 'geo', true: '◉', false: '' }] }
        );
        const s2 = segs(
            { value: 'p', counters: [{ key: 'star', true: '★' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'r', counters: [{ key: 'star', true: '★' }, { key: 'geo', true: '◉', false: '' }] },
            { value: 'other', counters: [{ key: 'star', true: '★' }, { key: 'geo', true: '◉', false: '' }] }
        );

        const out = run([
            file(s1, { star: 1, geo: 1 }),
            file(s2, { star: 1, geo: 0 })
        ]);

        // 'p' step: star true on both, geo true on file1 → both show "★ ◉".
        // 'q' step (file1): geo true on file1 → "★ ◉".
        // 'r' step (file2): geo false & no other file at that step → only "★".
        // Last segment: file → "★◉"; other → "★"
        assert.equal(render(out[0]), 'p ★ ◉/q ★ ◉/file ★◉');
        assert.equal(render(out[1]), 'p ★ ◉/r ★/other ★');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // DOT-PATH KEYS
    // ─────────────────────────────────────────────────────────────────────────────

    test('dot-path keys supported (no extensions)', () => {
        const s1 = segs(
            { value: 'a', counters: [{ key: 'flags.star', true: '★' }] },
            { value: 'b', counters: [{ key: 'flags.star', true: '★' }] },
            { value: 'x', counters: [{ key: 'flags.star', true: '★' }] }
        );
        const s2 = segs(
            { value: 'a', counters: [{ key: 'flags.star', true: '★' }] },
            { value: 'c', counters: [{ key: 'flags.star', true: '★' }] },
            { value: 'y', counters: [{ key: 'flags.star', true: '★' }] }
        );

        const out = run([
            file(s1, { flags: { star: true } }),
            file(s2, { flags: { star: false } })
        ]);

        assert.equal(render(out[0]), 'a ★/b ★/x ★');
        assert.equal(render(out[1]), 'a ★/c/y');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // COPY-ON-WRITE
    // ─────────────────────────────────────────────────────────────────────────────

    test('copy-on-write: unchanged keep identity; changed cloned (no extensions)', () => {
        const f1 = file(segs('x', 'one')); // no counters → unchanged identity

        const f2 = file(segs(
            { value: 'x', counters: [{ key: 'on', true: '✓', false: '' }] },
            { value: 'two', counters: [{ key: 'on', true: '✓', false: '' }] }
        ), { on: 0 });

        const f3 = file(segs(
            { value: 'x', counters: [{ key: 'on', true: '✓', false: '' }] },
            { value: 'three', counters: [{ key: 'on', true: '✓', false: '' }] }
        ), { on: 1 });

        const src = [f1, f2, f3];
        const out = run(src);

        assert.strictEqual(out[0], f1);    // unchanged
        assert.notStrictEqual(out[1], f2); // changed
        assert.notStrictEqual(out[2], f3); // changed

        // 'x' step has ✓ due to f3 → f2 shows ✓ at directory.
        // Filenames differ → only f3 filename shows ✓.
        assert.equal(render(out[1]), 'x ✓/two');
        assert.equal(render(out[2]), 'x ✓/three ✓');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // LAST-SEGMENT CONCATENATION
    // ─────────────────────────────────────────────────────────────────────────────

    test('last segment concatenates multiple indicators (no spaces) (no extensions)', () => {
        const seg = v => ({
            value: v,
            counters: [
                { key: 'a', true: 'A', false: '' },
                { key: 'b', true: 'B', false: '' },
                { key: 'c', true: 'C', false: '' }
            ]
        });

        const out = run([
            file([seg('root'), seg('name')], { a: 1, b: 1, c: 1 }),
            file([seg('root'), seg('other')], { a: 0, b: 1, c: 0 })
        ]);

        // 'root' shows "A B C" on both (due to file 1).
        // 'name' shows "ABC"; 'other' shows only "B".
        assert.equal(render(out[0]), 'root A B C/name ABC');
        assert.equal(render(out[1]), 'root A B C/other B');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // OMIT EMPTY FALSE DISPLAYS
    // ─────────────────────────────────────────────────────────────────────────────

    test('false/empty displays omitted cleanly (no extensions)', () => {
        const seg = v => ({
            value: v,
            counters: [{ key: 'hot', true: '🔥' }, { key: 'tag', true: '🏷', false: '' }]
        });

        const out = run([
            file([seg('a'), seg('file')], { hot: 0, tag: 0 }),
            file([seg('a'), seg('file2')], { hot: 1, tag: 0 })
        ]);

        // 'a' gets 🔥 due to file2; filenames differ so only 'file2' shows 🔥.
        assert.equal(render(out[0]), 'a 🔥/file');
        assert.equal(render(out[1]), 'a 🔥/file2 🔥');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // ATOMIC SEGMENT VALUES
    // ─────────────────────────────────────────────────────────────────────────────

    test('path-string segment remains atomic (no splitting inside a segment value)', () => {
        const seg = v => ({ value: v, counters: [{ key: 'flag', true: '✓', false: '' }] });

        const out = run([
            file([seg('a/b'), seg('x')], { flag: 1 }),
            file([seg('a/b'), seg('y')], { flag: 0 })
        ]);

        // Step is 'a/b' as a single segment; both share it and one is truthy -> ✓ at directory.
        // Filenames differ; only 'x' shows ✓.
        assert.equal(render(out[0]), 'a/b ✓/x ✓');
        assert.equal(render(out[1]), 'a/b ✓/y');
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // DEGENERATE CASES
    // ─────────────────────────────────────────────────────────────────────────────

    test('degenerate: empty segments arrays left unchanged', () => {
        const f1 = { segments: [] };
        const f2 = { segments: [] };
        const out = run([f1, f2]);

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
        assert.equal(render(out[0]), '');
        assert.equal(render(out[1]), '');
    });

    test('no indicators anywhere => identity preserved (no extensions)', () => {
        const f = file(segs('dir', 'file'));
        const out = run([f]);

        assert.strictEqual(out[0], f);
        assert.equal(render(out[0]), 'dir/file');
    });
};
