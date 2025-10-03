// tests/path/segments/insert-sequence-numbers.test.js
module.exports = ({ test, assert }) => $ => {

    const run = $.path.insertSequenceNumbers;
    const DELIM = $.config.path.delimiter;

    const segs = s => s.split(DELIM).map(v => ({ value: v }));
    const file = s => ({ segments: segs(s) });

    const vals = f => (f.segments || []).map(s => s.value);
    const render = f => vals(f).join(DELIM);

    test('adds numeric prefixes to each segment including filename', () => {
        const files = [
            file('a/b/x.txt'),
            file('a/c/y.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 a', '1 b', '1 x.txt']);
        assert.deepEqual(vals(actual[1]), ['1 a', '2 c', '2 y.txt']);
        assert.equal(render(actual[0]), '1 a/1 b/1 x.txt');
        assert.equal(render(actual[1]), '1 a/2 c/2 y.txt');
    });

    test('file at project root: single segment gets prefixed (still same identity object)', () => {
        const f = file('readme.md');
        const files = [f];
        const actual = run(files);

        // same file object reference preserved
        assert.strictEqual(actual[0], f);
        // filename token is decorated
        assert.deepEqual(vals(actual[0]), ['1 readme.md']);
        assert.equal(render(actual[0]), '1 readme.md');
    });

    test('deep nested paths get cumulative prefixes (including filename)', () => {
        const files = [
            file('a/b/c/d/e.txt'),
            file('a/b/other.txt'),
            file('a/z.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 a', '1 b', '1 c', '1 d', '1 e.txt']);
        assert.deepEqual(vals(actual[1]), ['1 a', '1 b', '2 other.txt']);
        // Only two segments here → 'a' dir + filename; filename gets one prefix
        assert.deepEqual(vals(actual[2]), ['1 a', '3 z.txt']);

        assert.equal(render(actual[0]), '1 a/1 b/1 c/1 d/1 e.txt');
        assert.equal(render(actual[1]), '1 a/1 b/2 other.txt');
        assert.equal(render(actual[2]), '1 a/3 z.txt');
    });

    test('repeated folder names at different depths are disambiguated by full cumulative path', () => {
        const files = [
            file('x/y/x/file.txt'),
            file('x/y/other.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 x', '1 y', '1 x', '1 file.txt']);
        assert.deepEqual(vals(actual[1]), ['1 x', '1 y', '2 other.txt']);

        assert.equal(render(actual[0]), '1 x/1 y/1 x/1 file.txt');
        assert.equal(render(actual[1]), '1 x/1 y/2 other.txt');
    });

    test('multiple top-level roots get independent numbering', () => {
        const files = [
            file('alpha/a.txt'),
            file('beta/b.txt'),
            file('beta/c/c.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 alpha', '1 a.txt']);
        assert.deepEqual(vals(actual[1]), ['2 beta', '2 b.txt']);
        assert.deepEqual(vals(actual[2]), ['2 beta', '3 c', '3 c.txt']);

        assert.equal(render(actual[0]), '1 alpha/1 a.txt');
        assert.equal(render(actual[1]), '2 beta/2 b.txt');
        assert.equal(render(actual[2]), '2 beta/3 c/3 c.txt');
    });

    test('sequenceNumbers=false disables decoration for that segment but still advances cumulative', () => {
        const files = [{
            segments: [
                { value: 'a', sequenceNumbers: false },
                { value: 'b' },
                { value: 'file.txt' }
            ]
        }];
        const actual = run(files);

        // 'a' not decorated, but cumulative advanced, so b and file get the correct index
        assert.deepEqual(vals(actual[0]), ['a', '1 b', '1 file.txt']);
        assert.equal(render(actual[0]), 'a/1 b/1 file.txt');
    });

    test('splits path-string segments and rejoins with delimiter (filename prefixed too)', () => {
        const files = [{
            segments: [
                { value: 'root/child' },
                { value: 'file.txt' }
            ]
        }];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 root/1 child', '1 file.txt']);
        assert.strictEqual(typeof actual[0].segments[0].value, 'string');
        assert.equal(render(actual[0]), '1 root/1 child/1 file.txt');
    });

    test('mono option applies mono-space formatting to prefixes (smoke check)', () => {
        const files = [
            file('a/b/file.txt'),
            file('c/d/file.txt')
        ];
        const actual = run(files, { mono: true });

        // Loose check: value starts with some non-space prefix then a space then 'a'
        assert.match(actual[0].segments[0].value, /^\S+\s+a$/);
    });

    // ---------------------------
    // padZero behaviour (10+ files)
    // ---------------------------
    test('padZero uses two digits when file count >= 10 (directory and filename)', () => {
        // Create 12 files: a..l/f.txt
        const letters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(97 + i)); // 'a'..'l'
        const files = letters.map(ch => file(`${ch}/f.txt`));

        const actual = run(files);

        // With 12 files, padZero should produce two-digit prefixes:
        // File 1: '01 a' / '01 f.txt'
        // File 10: '10 j' / '10 f.txt'
        // File 12: '12 l' / '12 f.txt'
        assert.deepEqual(vals(actual[0]), ['01 a', '01 f.txt']);   // index 1 -> '01'
        assert.deepEqual(vals(actual[9]), ['10 j', '10 f.txt']);   // index 10 -> '10'
        assert.deepEqual(vals(actual[11]), ['12 l', '12 f.txt']);  // index 12 -> '12'

        assert.equal(render(actual[0]), '01 a/01 f.txt');
        assert.equal(render(actual[9]), '10 j/10 f.txt');
        assert.equal(render(actual[11]), '12 l/12 f.txt');
    });
};
