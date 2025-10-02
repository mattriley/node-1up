module.exports = ({ test, assert }) => $ => {

    const run = $.path.segments.insertCopyCounters;
    const DELIM = $.config.path.delimiter;

    // Helpers
    const segs = s => s.split(DELIM).map(v => ({ value: v }));
    const render = segments =>
        (segments || [])
            .map(s => `${s?.value ?? ''}${s?.suffix ?? ''}`.trim())
            .filter(Boolean)
            .join(DELIM);

    test('adds .<n> suffix when duplicate basename in same dir (no extensions)', () => {
        const files = [
            segs('a/b/file'),
            segs('a/b/file')
        ];
        const out = run(files);

        assert.equal(render(out[0]), 'a/b/file.1');
        assert.equal(render(out[1]), 'a/b/file.2');
    });

    test('different directories do not collide', () => {
        const files = [
            segs('a/file'),
            segs('b/file')
        ];
        const out = run(files);

        assert.equal(render(out[0]), 'a/file');
        assert.equal(render(out[1]), 'b/file');
        // identity preserved for unchanged items
        assert.strictEqual(out[0], files[0]);
        assert.strictEqual(out[1], files[1]);
    });

    test('already suffixed basename is not double-added', () => {
        const files = [
            segs('a/file'),
            [{ value: 'a' }, { value: 'file', suffix: '.7' }]
        ];
        const out = run(files);

        assert.equal(render(out[0]), 'a/file.1');
        assert.equal(render(out[1]), 'a/file.7');
    });

    test('only the last segment changes; earlier segments keep identity', () => {
        const s0 = { value: 'a', mark: 1 };
        const s1 = { value: 'b', mark: 2 };
        const s2 = { value: 'file', mark: 3 };
        const f1 = [s0, s1, s2];
        const f2 = segs('a/b/file'); // duplicate to force counters

        const out = run([f1, f2]);

        assert.equal(render(out[0]), 'a/b/file.1');
        assert.equal(render(out[1]), 'a/b/file.2');

        // earlier segment objects preserved
        assert.strictEqual(out[0][0], s0);
        assert.strictEqual(out[0][1], s1);
        // last segment replaced (spread props preserved)
        assert.notStrictEqual(out[0][2], s2);
        assert.equal(out[0][2].mark, 3);
    });

    test('multi-level directories: only exact dir+basename collide', () => {
        const files = [
            segs('a/x/file'),
            segs('a/y/file'),
            segs('a/x/file')
        ];
        const out = run(files);

        assert.equal(render(out[0]), 'a/x/file.1');
        assert.equal(render(out[1]), 'a/y/file');
        assert.equal(render(out[2]), 'a/x/file.2');
    });

    test('whitespace in value/suffix is trimmed when grouping and rendering', () => {
        const f1 = [{ value: 'a ' }, { value: 'file', suffix: '  ' }];
        const f2 = [{ value: 'a' }, { value: 'file' }];
        const out = run([f1, f2]);

        // They collide as 'a' + 'file'
        assert.equal(render(out[0]), 'a/file.1');
        assert.equal(render(out[1]), 'a/file.2');
    });

    test('empty segments remain unchanged', () => {
        const f1 = [];
        const f2 = [];
        const out = run([f1, f2]);

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
        assert.equal(render(out[0]), '');
        assert.equal(render(out[1]), '');
    });

    test('single-segment duplicates collide correctly (no dir)', () => {
        const files = [
            segs('readme'),
            segs('readme')
        ];
        const out = run(files);

        assert.equal(render(out[0]), 'readme.1');
        assert.equal(render(out[1]), 'readme.2');
    });

    test('unchanged unique items preserve identity (copy-on-write)', () => {
        const f1 = segs('a/unique');
        const f2 = segs('a/other');
        const out = run([f1, f2]);

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
    });
};
