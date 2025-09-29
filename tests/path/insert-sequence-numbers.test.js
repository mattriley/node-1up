// tests/withSortPrefixes.v2.test.js
module.exports = ({ test, assert }) => lib => {

    const run = lib.path.insertSequenceNumbers;

    test('prefixes each segment by earliest file position for its cumulative step (basic branching)', () => {
        const files = [
            { src: 'a/b/x.txt' }, // index 1
            { src: 'a/c/y.txt' }  // index 2
        ];
        const actual = run(files, 'src');

        // First file: 'a'(1) / 'a/b'(1) / 'a/b/x.txt'(1)
        assert.equal(actual[0].src, '1 a/1 b/1 x.txt');

        // Second file: 'a'(1) / 'a/c'(2) / 'a/c/y.txt'(2)
        assert.equal(actual[1].src, '1 a/2 c/2 y.txt');
    });

    test('deep nesting aggregates earliest indices correctly', () => {
        const files = [
            { src: 'a/b/c/d/e.txt' }, // 1
            { src: 'a/b/other.txt' }, // 2
            { src: 'a/z.txt' }        // 3
        ];
        const actual = run(files, 'src');

        assert.equal(actual[0].src, '1 a/1 b/1 c/1 d/1 e.txt');
        assert.equal(actual[1].src, '1 a/1 b/2 other.txt');
        assert.equal(actual[2].src, '1 a/3 z.txt');
    });

    test('zero-padding width scales with file count (>= 10 files → width 2)', () => {
        const files = Array.from({ length: 12 }, (_, i) => ({ src: `a/f${i + 1}.txt` }));
        const actual = run(files, 'src');

        // 'a' first seen at index 1 → "01"
        assert.equal(actual[0].src, '01 a/01 f1.txt');   // file 1
        assert.equal(actual[9].src, '01 a/10 f10.txt');  // file 10
        assert.equal(actual[11].src, '01 a/12 f12.txt'); // file 12
    });

    test('destKey defaults to sourceKey and preserves other fields (returns new objects)', () => {
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

    test('when sortPrefixScope is "none", returns the same array and untouched objects', () => {
        const files = [{ src: 'a/b.txt' }, { src: 'a/c.txt' }];
        const originalArray = files;
        const originalFirst = files[0];

        const actual = run(files, 'src', { sortPrefixScope: 'none' });

        assert.strictEqual(actual, originalArray);      // same array
        assert.strictEqual(actual[0], originalFirst);   // same object
        assert.equal(actual[0].src, 'a/b.txt');         // unchanged
        assert.equal(actual[1].src, 'a/c.txt');
    });

    test('absolute path: leading slash is not preserved; trailing slash is not preserved', () => {
        const files = [
            { src: '/root/thing.txt' },
            { src: 'a/b/' } // trailing slash case
        ];
        const actual = run(files, 'src');

        // Leading slash removed by current implementation
        assert.equal(actual[0].src, '1 root/1 thing.txt');

        // Trailing empty segment is dropped; earliest index for a/a-b is 2
        assert.equal(actual[1].src, '2 a/2 b');
    });

    test('mono: true wraps the numeric prefix but still includes a visible token', () => {
        const files = [{ src: 'only/one/here.md' }];
        const actual = run(files, 'src', { mono: true });

        // Check each segment looks like "<token><space><name>"
        const parts = actual[0].src.split('/');
        assert.equal(parts.length, 3);
        assert.match(parts[0], /^\S+\sonly$/);
        assert.match(parts[1], /^\S+\sone$/);
        assert.match(parts[2], /^\S+\shere\.md$/);
    });

    test('object-segment paths are not supported yet (throws)', () => {
        const files = [
            {
                src: [
                    { value: 'a' },
                    { value: 'b', sortPrefix: false }, // disabled
                    { value: 'c' }
                ]
            }
        ];
        assert.throws(() => run(files, 'src'), /split is not a function/);
    });

};
