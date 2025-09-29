module.exports = ({ test, assert }) => $ => {

    // Helper to mirror the library’s zero-padding logic:
    // width is derived from the number of files (max value).
    const pad = (val, maxVal) => String(val).padStart(String(maxVal).length, '0');
    const mono = s => s; // $.str.mono is a visual wrapper; treat as identity in expectations

    // Small helper to build the expected prefixed path from a list of segments
    const expectPrefixed = (segments, prefixes) =>
        segments.map((seg, i) => `${mono(pad(prefixes[i], prefixes.length ? Math.max(...prefixes) : 0))} ${seg}`).join('/');

    const run = $.path.insertSequenceNumbers;

    test('prefixes each segment using earliest file position where that cumulative path appears (basic branching)', () => {
        const files = [
            { src: 'a/b/x.txt' }, // index 1
            { src: 'a/c/y.txt' }  // index 2
        ];
        const actual = run(files, 'src');

        // width = 1 (two files → max index 2 → width 1)
        // cumulative steps for first file:
        // 'a' -> first seen at 1
        // 'a/b' -> first seen at 1
        // 'a/b/x.txt' -> seen at 1
        assert.equal(actual[0].src, '1 a/1 b/1 x.txt');

        // cumulative steps for second file:
        // 'a' -> first seen at 1
        // 'a/c' -> first seen at 2
        // 'a/c/y.txt' -> seen at 2
        assert.equal(actual[1].src, '1 a/2 c/2 y.txt');
    });

    test('deep nesting aggregates earliest indices correctly', () => {
        const files = [
            { src: 'a/b/c/d/e.txt' }, // index 1
            { src: 'a/b/other.txt' }, // index 2
            { src: 'a/z.txt' }        // index 3
        ];
        const actual = run(files, 'src');

        // First file: a(1) / a/b(1) / a/b/c(1) / a/b/c/d(1) / a/b/c/d/e.txt(1)
        assert.equal(actual[0].src, '1 a/1 b/1 c/1 d/1 e.txt');

        // Second file: a(1) / a/b(1) / a/b/other.txt(2)
        assert.equal(actual[1].src, '1 a/1 b/2 other.txt');

        // Third file: a(1) / a/z.txt(3)
        assert.equal(actual[2].src, '1 a/3 z.txt');
    });

    test('repeated folder names at different depths are keyed by cumulative path, not basename', () => {
        const files = [
            { src: 'x/y/x/file.txt' }, // index 1
            { src: 'x/y/other.txt' }   // index 2
        ];
        const actual = run(files, 'src');

        // cumulative steps:
        // 'x'(1), 'x/y'(1), 'x/y/x'(1), 'x/y/x/file.txt'(1)
        assert.equal(actual[0].src, '1 x/1 y/1 x/1 file.txt');

        // 'x'(1), 'x/y'(1), 'x/y/other.txt'(2)
        assert.equal(actual[1].src, '1 x/1 y/2 other.txt');
    });

    test('multiple independent top-level roots get their own earliest indices', () => {
        const files = [
            { src: 'alpha/a.txt' },  // 1
            { src: 'beta/b.txt' },   // 2
            { src: 'beta/c/c.txt' }  // 3
        ];
        const actual = run(files, 'src');

        // 'alpha'(1) / 'alpha/a.txt'(1)
        assert.equal(actual[0].src, '1 alpha/1 a.txt');

        // 'beta'(2) / 'beta/b.txt'(2)
        assert.equal(actual[1].src, '2 beta/2 b.txt');

        // 'beta'(2) / 'beta/c'(3) / 'beta/c/c.txt'(3)
        assert.equal(actual[2].src, '2 beta/3 c/3 c.txt');
    });

    test('defaults to overwriting sourceKey and preserves other fields (returns new objects)', () => {
        const files = [{ path: 'a/b/file.txt', meta: { id: 7 } }];
        const actual = run(files, 'path');

        assert.equal(actual[0].path, '1 a/1 b/1 file.txt');
        assert.deepEqual(actual[0].meta, { id: 7 });
        assert.notStrictEqual(actual[0], files[0]);
    });

    test('writes to custom destKey without mutating the sourceKey', () => {
        const files = [{ src: 'a/b/file.txt' }];
        const actual = run(files, 'src', { destKey: 'out' });

        assert.equal(actual[0].src, 'a/b/file.txt');
        assert.equal(actual[0].out, '1 a/1 b/1 file.txt');
    });

    test('single file yields width-1 prefixes ("1 ") on all segments', () => {
        const files = [{ src: 'only/one/here.md' }];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, '1 only/1 one/1 here.md');
    });

    test('prefix width scales with file count (zero-padded when >= 10 files)', () => {
        // 12 files to force width=2
        const files = Array.from({ length: 12 }, (_, i) => ({ src: `a/f${i + 1}.txt` }));
        const actual = run(files, 'src');

        // First file: a(01) / a/f1.txt(01)
        assert.equal(actual[0].src, '01 a/01 f1.txt');

        // Tenth file: a(01) / a/f10.txt(10)
        assert.equal(actual[9].src, '01 a/10 f10.txt');

        // Twelfth file: a(01) / a/f12.txt(12)
        assert.equal(actual[11].src, '01 a/12 f12.txt');
    });

    test('when sortPrefixScope is "none", returns the same array and objects unchanged', () => {
        const files = [{ src: 'a/b.txt' }, { src: 'a/c.txt' }];
        const originalArray = files;
        const originalFirst = files[0];

        // Assuming parseOptions understands { sortPrefixScope: 'none' }
        const actual = run(files, 'src', { sortPrefixScope: 'none' });

        assert.strictEqual(actual, originalArray);      // same array
        assert.strictEqual(actual[0], originalFirst);   // same object
        assert.equal(actual[0].src, 'a/b.txt');         // path untouched
        assert.equal(actual[1].src, 'a/c.txt');
    });

    test('preserves leading slash for absolute paths', () => {
        const files = [{ src: '/root/thing.txt' }];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, '/1 root/1 thing.txt');
    });
};
