// tests/path/segments/insert-copy-counters.test.js
module.exports = ({ test, assert }) => $ => {

    const run = $.path.insertCopyCounters;
    const DELIM = $.config.path.delimiter;

    // Helpers
    const segs = s => s.split(DELIM).map(v => ({ value: v }));
    const file = s => ({ segments: segs(s) });
    const renderFile = f =>
        (f.segments || [])
            .map(s => `${s?.value ?? ''}${s?.suffix ?? ''}`.trim())
            .filter(Boolean)
            .join(DELIM);

    test('adds .<n> suffix when duplicate basename in same dir (no extensions)', () => {
        const files = [
            file('a/b/file'),
            file('a/b/file')
        ];
        const out = run(files);

        assert.equal(renderFile(out[0]), 'a/b/file.1');
        assert.equal(renderFile(out[1]), 'a/b/file.2');
    });

    test('different directories do not collide', () => {
        const files = [
            file('a/file'),
            file('b/file')
        ];
        const out = run(files);

        assert.equal(renderFile(out[0]), 'a/file');
        assert.equal(renderFile(out[1]), 'b/file');
        // identity preserved for unchanged items
        assert.strictEqual(out[0], files[0]);
        assert.strictEqual(out[1], files[1]);
    });

    test('already suffixed basename is not double-added', () => {
        const files = [
            file('a/file'),
            { segments: [{ value: 'a' }, { value: 'file', suffix: '.7' }] }
        ];
        const out = run(files);

        assert.equal(renderFile(out[0]), 'a/file.1');
        assert.equal(renderFile(out[1]), 'a/file.7');
        // unchanged second item keeps identity
        assert.notStrictEqual(out[0], files[0]); // changed
        assert.strictEqual(out[1], files[1]);    // unchanged
    });

    test('only the last segment changes; earlier segments keep identity', () => {
        const s0 = { value: 'a', mark: 1 };
        const s1 = { value: 'b', mark: 2 };
        const s2 = { value: 'file', mark: 3 };
        const f1 = { segments: [s0, s1, s2] };
        const f2 = file('a/b/file'); // duplicate to force counters

        const out = run([f1, f2]);

        assert.equal(renderFile(out[0]), 'a/b/file.1');
        assert.equal(renderFile(out[1]), 'a/b/file.2');

        // earlier segment objects preserved
        assert.strictEqual(out[0].segments[0], s0);
        assert.strictEqual(out[0].segments[1], s1);
        // last segment replaced (spread props preserved)
        assert.notStrictEqual(out[0].segments[2], s2);
        assert.equal(out[0].segments[2].mark, 3);
    });

    test('multi-level directories: only exact dir+basename collide', () => {
        const files = [
            file('a/x/file'),
            file('a/y/file'),
            file('a/x/file')
        ];
        const out = run(files);

        assert.equal(renderFile(out[0]), 'a/x/file.1');
        assert.equal(renderFile(out[1]), 'a/y/file');
        assert.equal(renderFile(out[2]), 'a/x/file.2');
    });

    test('whitespace in value/suffix is trimmed when grouping and rendering', () => {
        const f1 = { segments: [{ value: 'a ' }, { value: 'file', suffix: '  ' }] };
        const f2 = { segments: [{ value: 'a' }, { value: 'file' }] };
        const out = run([f1, f2]);

        // They collide as 'a' + 'file'
        assert.equal(renderFile(out[0]), 'a/file.1');
        assert.equal(renderFile(out[1]), 'a/file.2');
    });

    test('empty segments remain unchanged', () => {
        const f1 = { segments: [] };
        const f2 = { segments: [] };
        const out = run([f1, f2]);

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
        assert.equal(renderFile(out[0]), '');
        assert.equal(renderFile(out[1]), '');
    });

    test('single-segment duplicates collide correctly (no dir)', () => {
        const files = [
            file('readme'),
            file('readme')
        ];
        const out = run(files);

        assert.equal(renderFile(out[0]), 'readme.1');
        assert.equal(renderFile(out[1]), 'readme.2');
    });

    test('unchanged unique items preserve identity (copy-on-write)', () => {
        const f1 = file('a/unique');
        const f2 = file('a/other');
        const out = run([f1, f2]);

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
    });
};
