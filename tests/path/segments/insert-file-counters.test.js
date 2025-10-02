// tests/path/segments/insert-file-counters.test.js
module.exports = ({ test, assert }) => $ => {

    const run = $.path.segments.insertFileCounters;
    const DELIM = $.config.path.delimiter;

    // Helpers
    const segs = s => s.split(DELIM).map(v => ({ value: v }));
    const file = s => ({ segments: segs(s) });
    const vals = f => (f.segments || []).map(s => s.value); // values are ALWAYS strings now
    const render = f => (f.segments || []).map(s => s.value).join(DELIM);

    test('adds counts to each directory segment across files (basic two-branch example)', () => {
        const files = [
            file('a/b/x.txt'),
            file('a/c/y.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (2)', 'b (1)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a (2)', 'c (1)', 'y.txt']);

        assert.equal(render(actual[0]), 'a (2)/b (1)/x.txt');
        assert.equal(render(actual[1]), 'a (2)/c (1)/y.txt');
    });

    test('file at project root (single segment) is returned unchanged and same object identity', () => {
        const f = file('readme.md');
        const files = [f];

        const actual = run(files);

        // same file object reference preserved
        assert.strictEqual(actual[0], f);
        // segments content unchanged
        assert.deepEqual(actual[0].segments, segs('readme.md'));
        assert.equal(render(actual[0]), 'readme.md');
    });

    test('deep nested path gets cumulative counts per level', () => {
        const files = [
            file('a/b/c/d/e.txt'),
            file('a/b/other.txt'),
            file('a/z.txt')
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
            file('x/y/x/file.txt'),
            file('x/y/other.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['x (2)', 'y (2)', 'x (1)', 'file.txt']);
        assert.deepEqual(vals(actual[1]), ['x (2)', 'y (2)', 'other.txt']);

        assert.equal(render(actual[0]), 'x (2)/y (2)/x (1)/file.txt');
        assert.equal(render(actual[1]), 'x (2)/y (2)/other.txt');
    });

    test('multiple top-level roots are independent', () => {
        const files = [
            file('alpha/a.txt'),
            file('beta/b.txt'),
            file('beta/c/c.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['alpha (1)', 'a.txt']);
        assert.deepEqual(vals(actual[1]), ['beta (2)', 'b.txt']);
        assert.deepEqual(vals(actual[2]), ['beta (2)', 'c (1)', 'c.txt']);

        assert.equal(render(actual[0]), 'alpha (1)/a.txt');
        assert.equal(render(actual[1]), 'beta (2)/b.txt');
        assert.equal(render(actual[2]), 'beta (2)/c (1)/c.txt');
    });

    test('preserves additional segment props (only replaces .value) and value is string', () => {
        const files = [{
            segments: [
                { value: 'a', flag: true },
                { value: 'b', meta: { id: 42 } },
                { value: 'f.txt', ix: 7 }
            ]
        }];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (1)', 'b (1)', 'f.txt']);
        assert.equal(actual[0].segments[0].flag, true);
        assert.deepEqual(actual[0].segments[1].meta, { id: 42 });
        assert.equal(actual[0].segments[2].ix, 7);

        // values are strings
        assert.strictEqual(typeof actual[0].segments[0].value, 'string');
        assert.strictEqual(typeof actual[0].segments[1].value, 'string');
        assert.strictEqual(typeof actual[0].segments[2].value, 'string');

        assert.equal(render(actual[0]), 'a (1)/b (1)/f.txt');
    });

    test('handles many files in the same folder (counter equals file count)', () => {
        const files = [
            file('photos/1.jpg'),
            file('photos/2.jpg'),
            file('photos/3.jpg')
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
            file('a/b/x.txt'),
            file('a/b/z.txt'),
            file('a/c/y.txt'),
            file('a/top.txt')
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
        const a = file('readme.md');        // no directory
        const b = file('docs/guide.md');    // has directory
        const src = [a, b];
        const out = run(src);

        assert.notStrictEqual(out, src);
        assert.strictEqual(out[0], a); // unchanged file keeps identity
        assert.notStrictEqual(out[1], b);
        assert.deepEqual(vals(out[1]), ['docs (1)', 'guide.md']);
        assert.equal(render(out[1]), 'docs (1)/guide.md');
    });

    test('works with numeric basenames and mixed extensions', () => {
        const files = [
            file('a/1'),
            file('a/2.txt'),
            file('a/3.jpeg')
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
    // Per-segment fileCounters flag
    // =========================

    test('respects per-segment fileCounters=false (directory segment shows no counter)', () => {
        const files = [
            {
                segments: [
                    { value: 'a', fileCounters: false },
                    { value: 'b' },
                    { value: 'x.txt' }
                ]
            },
            {
                segments: [
                    { value: 'a', fileCounters: false },
                    { value: 'c' },
                    { value: 'y.txt' }
                ]
            }
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
            {
                segments: [
                    { value: 'a' },
                    { value: 'b' },
                    { value: 'x.txt' }
                ]
            },
            {
                segments: [
                    { value: 'a' },
                    { value: 'c' },
                    { value: 'y.txt' }
                ]
            }
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['a (2)', 'b (1)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a (2)', 'c (1)', 'y.txt']);
    });

    // =========================
    // Path-string segment splitting
    // =========================

    test('splits a path-string segment and decorates each directory part, but returns string value', () => {
        const files = [
            {
                segments: [
                    // first segment contains a PATH STRING 'a/b' (should split to ['a','b'] internally)
                    { value: 'a/b' },
                    { value: 'x.txt' }
                ]
            },
            {
                segments: [
                    { value: 'a/c' },
                    { value: 'y.txt' }
                ]
            }
        ];
        const actual = run(files);

        // After split & decorate, the segment value is a STRING with internal delimiter
        assert.deepEqual(vals(actual[0]), ['a (2)/b (1)', 'x.txt']);
        assert.deepEqual(vals(actual[1]), ['a (2)/c (1)', 'y.txt']);

        // Rendered full path is correct
        assert.equal(render(actual[0]), 'a (2)/b (1)/x.txt');
        assert.equal(render(actual[1]), 'a (2)/c (1)/y.txt');

        // Values are strings
        assert.strictEqual(typeof actual[0].segments[0].value, 'string');
        assert.strictEqual(typeof actual[1].segments[0].value, 'string');
    });

    test('path-string segment with fileCounters=false splits for counting but returns undecorated string', () => {
        const files = [
            {
                segments: [
                    { value: 'root/child', fileCounters: false },
                    { value: 'a.txt' }
                ]
            },
            {
                segments: [
                    { value: 'root/other', fileCounters: false },
                    { value: 'b.txt' }
                ]
            }
        ];
        const actual = run(files);

        // Counts would be: 'root' -> 2, 'root/child' -> 1, 'root/other' -> 1
        // But decoration is suppressed on that segment; still returned as a STRING path
        assert.deepEqual(vals(actual[0]), ['root/child', 'a.txt']);
        assert.deepEqual(vals(actual[1]), ['root/other', 'b.txt']);

        assert.equal(render(actual[0]), 'root/child/a.txt');
        assert.equal(render(actual[1]), 'root/other/b.txt');

        // Values are strings
        assert.strictEqual(typeof actual[0].segments[0].value, 'string');
        assert.strictEqual(typeof actual[1].segments[0].value, 'string');
    });
};
