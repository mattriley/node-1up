module.exports = ({ test, assert }) => lib => {

    const run = lib.path.insertFileCounters;

    test('adds counts to each directory segment across files (basic two-branch example)', () => {
        const files = [
            { src: 'a/b/x.txt' },
            { src: 'a/c/y.txt' }
        ];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, 'a (2)/b (1)/x.txt');
        assert.equal(actual[1].src, 'a (2)/c (1)/y.txt');
    });

    test('file at project root (no directory) is returned unchanged and same object identity', () => {
        const file = { src: 'readme.md' };
        const files = [file];
        const actual = run(files, 'src');

        // unchanged
        assert.equal(actual[0].src, 'readme.md');
        // same reference (the impl returns f directly when !dir)
        assert.strictEqual(actual[0], file);
    });

    test('deep nested path gets cumulative counts per level', () => {
        const files = [
            { src: 'a/b/c/d/e.txt' },
            { src: 'a/b/other.txt' },
            { src: 'a/z.txt' }
        ];
        const actual = run(files, 'src');

        // counts:
        // 'a' -> 3 (appears in all three)
        // 'a/b' -> 2 (first two)
        // 'a/b/c' -> 1
        // 'a/b/c/d' -> 1
        assert.equal(actual[0].src, 'a (3)/b (2)/c (1)/d (1)/e.txt');
        assert.equal(actual[1].src, 'a (3)/b (2)/other.txt');
        assert.equal(actual[2].src, 'a (3)/z.txt');
    });

    test('repeated folder names at different depths are counted by full path, not basename', () => {
        const files = [
            { src: 'x/y/x/file.txt' },
            { src: 'x/y/other.txt' }
        ];
        const actual = run(files, 'src');

        // cumulative paths seen:
        // 'x' -> 2
        // 'x/y' -> 2
        // 'x/y/x' -> 1
        assert.equal(actual[0].src, 'x (2)/y (2)/x (1)/file.txt');
        assert.equal(actual[1].src, 'x (2)/y (2)/other.txt');
    });

    test('multiple top-level roots are independent', () => {
        const files = [
            { src: 'alpha/a.txt' },
            { src: 'beta/b.txt' },
            { src: 'beta/c/c.txt' }
        ];
        const actual = run(files, 'src');

        // counts:
        // 'alpha' -> 1
        // 'beta' -> 2
        // 'beta/c' -> 1
        assert.equal(actual[0].src, 'alpha (1)/a.txt');
        assert.equal(actual[1].src, 'beta (2)/b.txt');
        assert.equal(actual[2].src, 'beta (2)/c (1)/c.txt');
    });

    test('destKey defaults to sourceKey (overwrites in a new object)', () => {
        const files = [{ path: 'a/b/file.txt', other: 1 }];
        const actual = run(files, 'path');

        // Overwritten path string, but new object (spread) according to impl
        assert.equal(actual[0].path, 'a (1)/b (1)/file.txt');
        assert.equal(actual[0].other, 1);
        assert.notStrictEqual(actual[0], files[0]);
    });

    test('writes to custom destKey without touching the sourceKey', () => {
        const files = [{ src: 'a/b/file.txt' }];
        const actual = run(files, 'src', 'out');

        // src unchanged
        assert.equal(actual[0].src, 'a/b/file.txt');
        // out has decorated path
        assert.equal(actual[0].out, 'a (1)/b (1)/file.txt');
    });

    test('handles many files in the same folder (counter equals file count)', () => {
        const files = [
            { src: 'photos/1.jpg' },
            { src: 'photos/2.jpg' },
            { src: 'photos/3.jpg' }
        ];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, 'photos (3)/1.jpg');
        assert.equal(actual[1].src, 'photos (3)/2.jpg');
        assert.equal(actual[2].src, 'photos (3)/3.jpg');
    });

    test('preserves additional keys via object spread when a directory exists', () => {
        const files = [{ src: 'a/b/f.txt', meta: { id: 42 } }];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, 'a (1)/b (1)/f.txt');
        assert.deepEqual(actual[0].meta, { id: 42 });
    });

    test('supports numeric basenames and mixed extensions', () => {
        const files = [
            { src: 'a/1' },
            { src: 'a/2.txt' },
            { src: 'a/3.jpeg' }
        ];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, 'a (3)/1');
        assert.equal(actual[1].src, 'a (3)/2.txt');
        assert.equal(actual[2].src, 'a (3)/3.jpeg');
    });

    // Edge-ish behaviour note:
    // The implementation uses node:path.parse, so inputs ending with a path
    // separator (i.e., directory references rather than files) won’t be
    // decorated because parse(dirPath).base === '' — keep inputs as file paths.
};
