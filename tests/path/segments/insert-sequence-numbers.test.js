module.exports = ({ test, assert }) => $ => {

    const run = $.path.segments.insertSequenceNumbers;
    const DELIM = $.config.path.delimiter;

    const segs = s => s.split(DELIM).map(v => ({ value: v }));
    const vals = segments => segments.map(s => s.value);
    const render = segments => vals(segments).join(DELIM);

    test('adds numeric prefixes to each segment including filename', () => {
        const files = [
            segs('a/b/x.txt'),
            segs('a/c/y.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 a', '1 b', '1 x.txt']);
        assert.deepEqual(vals(actual[1]), ['1 a', '2 c', '2 y.txt']);
        assert.equal(render(actual[0]), '1 a/1 b/1 x.txt');
        assert.equal(render(actual[1]), '1 a/2 c/2 y.txt');
    });

    test('file at project root: single segment gets prefixed (still same identity array)', () => {
        const file = segs('readme.md');
        const files = [file];
        const actual = run(files);

        // same array reference preserved
        assert.strictEqual(actual[0], file);
        // filename token is decorated
        assert.deepEqual(vals(actual[0]), ['1 readme.md']);
        assert.equal(render(actual[0]), '1 readme.md');
    });

    test('deep nested paths get cumulative prefixes (including filename)', () => {
        const files = [
            segs('a/b/c/d/e.txt'),
            segs('a/b/other.txt'),
            segs('a/z.txt')
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
            segs('x/y/x/file.txt'),
            segs('x/y/other.txt')
        ];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 x', '1 y', '1 x', '1 file.txt']);
        assert.deepEqual(vals(actual[1]), ['1 x', '1 y', '2 other.txt']);

        assert.equal(render(actual[0]), '1 x/1 y/1 x/1 file.txt');
        assert.equal(render(actual[1]), '1 x/1 y/2 other.txt');
    });

    test('multiple top-level roots get independent numbering', () => {
        const files = [
            segs('alpha/a.txt'),
            segs('beta/b.txt'),
            segs('beta/c/c.txt')
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
        const files = [[
            { value: 'a', sequenceNumbers: false },
            { value: 'b' },
            { value: 'file.txt' }
        ]];
        const actual = run(files);

        // 'a' not decorated, but cumulative advanced, so b and file get the correct index
        assert.deepEqual(vals(actual[0]), ['a', '1 b', '1 file.txt']);
        assert.equal(render(actual[0]), 'a/1 b/1 file.txt');
    });

    test('splits path-string segments and rejoins with delimiter (filename prefixed too)', () => {
        const files = [[
            { value: 'root/child' },
            { value: 'file.txt' }
        ]];
        const actual = run(files);

        assert.deepEqual(vals(actual[0]), ['1 root/1 child', '1 file.txt']);
        assert.strictEqual(typeof actual[0][0].value, 'string');
        assert.equal(render(actual[0]), '1 root/1 child/1 file.txt');
    });

    test('mono option applies mono-space formatting to prefixes (smoke check)', () => {
        const files = [
            segs('a/b/file.txt'),
            segs('c/d/file.txt')
        ];
        const actual = run(files, { mono: true });

        // Loose check: value starts with some non-space prefix then a space then 'a'
        assert.match(actual[0][0].value, /^\S+\s+a$/);
    });

    // ---------------------------
    // padZero behaviour (10+ files)
    // ---------------------------
    test('padZero uses two digits when file count >= 10 (directory and filename)', () => {
        // Create 12 files: a..l/f.txt
        const letters = Array.from({ length: 12 }, (_, i) => String.fromCharCode(97 + i)); // 'a'..'l'
        const files = letters.map(ch => segs(`${ch}/f.txt`));

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
