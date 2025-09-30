module.exports = ({ test, assert }) => $ => {

    const run = $.path.segments.insertFileCounters;

    // Helpers
    const segs = s => s.split($.config.path.delimiter).map(v => ({ value: v }));
    const vals = segments =>
        segments.flatMap(s => Array.isArray(s.value) ? s.value : [s.value]);
    const render = segments =>
        vals(segments).join($.config.path.delimiter);

    test('adds counts to each directory segment across files (basic two-branch example)', () => {
        const files = [
            segs('a/b/x.txt'),
            segs('a/c/y.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (2)', 'b (1)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a (2)', 'c (1)', 'y.txt']);

        assert.equal(render(actual[0]), 'a (2)/b (1)/x.txt');
        assert.equal(render(actual[1]), 'a (2)/c (1)/y.txt');
    });

    test('file at project root (single segment) is returned unchanged and same object identity', () => {
        const file = segs('readme.md');
        const files = [file];

        const actual = run(files);

        assert.strictEqual(actual[0], file);
        assert.deepEqual(actual[0], segs('readme.md'));
        assert.equal(render(actual[0]), 'readme.md');
    });

    test('deep nested path gets cumulative counts per level', () => {
        const files = [
            segs('a/b/c/d/e.txt'),
            segs('a/b/other.txt'),
            segs('a/z.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (3)', 'b (2)', 'c (1)', 'd (1)', 'e.txt']);
        assert.deepEqual(vals(actual[1]), ['a (3)', 'b (2)', 'other.txt']);
        assert.deepEqual(vals(actual[2]), ['a (3)', 'z.txt']);

        assert.equal(render(actual[0]), 'a (3)/b (2)/c (1)/d (1)/e.txt');
        assert.equal(render(actual[1]), 'a (3)/b (2)/other.txt');
        assert.equal(render(actual[2]), 'a (3)/z.txt');
    });

    test('repeated folder names at different depths are counted by full path, not basename', () => {
        const files = [
            segs('x/y/x/file.txt'),
            segs('x/y/other.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['x (2)', 'y (2)', 'x (1)', 'file.txt']);
        assert.deepEqual(vals(actual[1]), ['x (2)', 'y (2)', 'other.txt']);

        assert.equal(render(actual[0]), 'x (2)/y (2)/x (1)/file.txt');
        assert.equal(render(actual[1]), 'x (2)/y (2)/other.txt');
    });

    test('multiple top-level roots are independent', () => {
        const files = [
            segs('alpha/a.txt'),
            segs('beta/b.txt'),
            segs('beta/c/c.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['alpha (1)', 'a.txt']);
        assert.deepEqual(vals(actual[1]), ['beta (2)', 'b.txt']);
        assert.deepEqual(vals(actual[2]), ['beta (2)', 'c (1)', 'c.txt']);

        assert.equal(render(actual[0]), 'alpha (1)/a.txt');
        assert.equal(render(actual[1]), 'beta (2)/b.txt');
        assert.equal(render(actual[2]), 'beta (2)/c (1)/c.txt');
    });

    test('preserves additional segment props (only replaces .value)', () => {
        const files = [[
            { value: 'a', flag: true },
            { value: 'b', meta: { id: 42 } },
            { value: 'f.txt', ix: 7 }
        ]];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (1)', 'b (1)', 'f.txt']);
        assert.equal(actual[0][0].flag, true);
        assert.deepEqual(actual[0][1].meta, { id: 42 });
        assert.equal(actual[0][2].ix, 7);

        assert.equal(render(actual[0]), 'a (1)/b (1)/f.txt');
    });

    test('handles many files in the same folder (counter equals file count)', () => {
        const files = [
            segs('photos/1.jpg'),
            segs('photos/2.jpg'),
            segs('photos/3.jpg')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['photos (3)', '1.jpg']);
        assert.deepEqual(vals(actual[1]), ['photos (3)', '2.jpg']);
        assert.deepEqual(vals(actual[2]), ['photos (3)', '3.jpg']);

        assert.equal(render(actual[0]), 'photos (3)/1.jpg');
        assert.equal(render(actual[1]), 'photos (3)/2.jpg');
        assert.equal(render(actual[2]), 'photos (3)/3.jpg');
    });

    test('mix of simple and deep paths share the same top-level counts', () => {
        const files = [
            segs('a/b/x.txt'),
            segs('a/b/z.txt'),
            segs('a/c/y.txt'),
            segs('a/top.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (4)', 'b (2)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a (4)', 'b (2)', 'z.txt']);
        assert.deepEqual(vals(actual[2]), ['a (4)', 'c (1)', 'y.txt']);
        assert.deepEqual(vals(actual[3]), ['a (4)', 'top.txt']);

        assert.equal(render(actual[0]), 'a (4)/b (2)/x.txt');
        assert.equal(render(actual[1]), 'a (4)/b (2)/z.txt');
        assert.equal(render(actual[2]), 'a (4)/c (1)/y.txt');
        assert.equal(render(actual[3]), 'a (4)/top.txt');
    });

    test('returns a new array for files list but preserves per-item identity when no directory', () => {
        const a = segs('readme.md');
        const b = segs('docs/guide.md');
        const src = [a, b];
        const out = run(src);

        assert.notStrictEqual(out, src);
        assert.strictEqual(out[0], a);
        assert.notStrictEqual(out[1], b);
        assert.deepEqual(vals(out[1]), ['docs (1)', 'guide.md']);
        assert.equal(render(out[1]), 'docs (1)/guide.md');
    });

    test('works with numeric basenames and mixed extensions', () => {
        const files = [
            segs('a/1'),
            segs('a/2.txt'),
            segs('a/3.jpeg')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (3)', '1']);
        assert.deepEqual(vals(actual[1]), ['a (3)', '2.txt']);
        assert.deepEqual(vals(actual[2]), ['a (3)', '3.jpeg']);

        assert.equal(render(actual[0]), 'a (3)/1');
        assert.equal(render(actual[1]), 'a (3)/2.txt');
        assert.equal(render(actual[2]), 'a (3)/3.jpeg');
    });

    // =========================
    // NEW: per-segment fileCounters flag
    // =========================

    test('respects per-segment fileCounters=false (directory segment shows no counter)', () => {
        const files = [
            [
                { value: 'a', fileCounters: false },
                { value: 'b' },
                { value: 'x.txt' }
            ],
            [
                { value: 'a', fileCounters: false },
                { value: 'c' },
                { value: 'y.txt' }
            ]
        ];
        const actual = run(files);

        // counts would be: 'a' -> 2, 'a/b' -> 1, 'a/c' -> 1
        // but 'a' opts out of decoration
        assert.deepEqual(vals(actual[0]), ['a', 'b (1)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a', 'c (1)', 'y.txt']);

        assert.equal(render(actual[0]), 'a/b (1)/x.txt');
        assert.equal(render(actual[1]), 'a/c (1)/y.txt');
    });

    test('fileCounters defaults to true (omitting flag decorates as usual)', () => {
        const files = [
            [
                { value: 'a' },            // defaults to true -> decorate
                { value: 'b' },
                { value: 'x.txt' }
            ],
            [
                { value: 'a' },
                { value: 'c' },
                { value: 'y.txt' }
            ]
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (2)', 'b (1)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a (2)', 'c (1)', 'y.txt']);
    });
};
