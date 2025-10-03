// tests/path/insert-chunk-numbers.test.js
module.exports = ({ test, assert }) => $ => {

    const run = $.path.insertChunkNumbers;
    const DELIM = $.config.path.delimiter;

    // Helpers
    const segs = s => s.split(DELIM).map(v => ({ value: v }));
    const file = s => ({ segments: segs(s) });
    const render = f => (f.segments || []).map(s => s.value).join(DELIM);

    test('inserts chunk numbers before the last segment for groups that split into multiple chunks', () => {
        // 5 files in same dir; chunkSize=2 -> chunks: [0,1], [2,3], [4] → total 3 chunks
        const files = [
            file('a/b/1.txt'),
            file('a/b/2.txt'),
            file('a/b/3.txt'),
            file('a/b/4.txt'),
            file('a/b/5.txt'),
        ];
        const out = run(files, { chunkSize: 2 });

        // Expect a/b/<chunk>/file
        assert.equal(render(out[0]), 'a/b/1/1.txt');
        assert.equal(render(out[1]), 'a/b/1/2.txt');
        assert.equal(render(out[2]), 'a/b/2/3.txt');
        assert.equal(render(out[3]), 'a/b/2/4.txt');
        assert.equal(render(out[4]), 'a/b/3/5.txt');
    });

    test('groups are independent per directory', () => {
        // a/b has 3 items -> with chunkSize=2 -> 2 chunks total → insert
        // a/c has 2 items -> one chunk (== chunkSize) → only 1 chunk → no insert
        const files = [
            file('a/b/x.txt'),
            file('a/b/y.txt'),
            file('a/b/z.txt'),
            file('a/c/u.txt'),
            file('a/c/v.txt'),
        ];
        const out = run(files, { chunkSize: 2 });

        // a/b got chunk numbers
        assert.equal(render(out[0]), 'a/b/1/x.txt');
        assert.equal(render(out[1]), 'a/b/1/y.txt');
        assert.equal(render(out[2]), 'a/b/2/z.txt');

        // a/c did not (only one chunk) — identity and path unchanged
        assert.strictEqual(out[3], files[3]);
        assert.strictEqual(out[4], files[4]);
        assert.equal(render(out[3]), 'a/c/u.txt');
        assert.equal(render(out[4]), 'a/c/v.txt');
    });

    test('files at project root are grouped together; chunking applies there too', () => {
        const a = file('readme.md');
        const b = file('todo.md');
        const c = file('notes.md');

        // chunkSize=2 -> 2 chunks total → insert
        const out = run([a, b, c], { chunkSize: 2 });

        // Inserted as a new segment before the last segment (which is the filename)
        assert.equal(render(out[0]), '1/readme.md');
        assert.equal(render(out[1]), '1/todo.md');
        assert.equal(render(out[2]), '2/notes.md');
    });

    test('when a directory yields only one chunk (<= chunkSize), nothing changes and per-item identity is preserved', () => {
        const a = file('docs/guide.md');
        const b = file('docs/faq.md');

        // chunkSize=3 => only one chunk -> unchanged (outer array may be copied; per-item identity should remain)
        const src = [a, b];
        const out = run(src, { chunkSize: 3 });

        // per-item identity preserved
        assert.strictEqual(out[0], a);
        assert.strictEqual(out[1], b);
        assert.equal(render(out[0]), 'docs/guide.md');
        assert.equal(render(out[1]), 'docs/faq.md');
    });

    test('insertion happens as a new segment before the last segment, preserving earlier segment objects', () => {
        const s0 = { value: 'a', mark: 1 };
        const s1 = { value: 'b', mark: 2 };
        const s2 = { value: 'f.txt', mark: 3 };
        const f1 = { segments: [s0, s1, s2] };
        const f2 = file('a/b/g.txt');
        const src = [f1, f2];

        // chunkSize=1 → each file is its own chunk → total 2 chunks → inserted numbers will be '1' and '2'
        const out = run(src, { chunkSize: 1 });

        // Expect: a/b/<chunk>/file (no zero padding when total chunks < 10)
        assert.equal(render(out[0]), 'a/b/1/f.txt');
        assert.equal(render(out[1]), 'a/b/2/g.txt');

        // Earlier segments should be the same references on f1
        assert.strictEqual(out[0].segments[0], s0);
        assert.strictEqual(out[0].segments[1], s1);
        // New chunk segment inserted; last file segment remains original object
        assert.strictEqual(out[0].segments[3], s2);
    });

    test('path-string segments are tokenized for directory grouping; chunk number is inserted as its own segment', () => {
        const files = [
            { segments: [{ value: 'a/b' }, { value: 'x.txt' }] },
            { segments: [{ value: 'a/b' }, { value: 'y.txt' }] },
            { segments: [{ value: 'a/b' }, { value: 'z.txt' }] }
        ];

        // With chunkSize=2 -> 2 chunks -> insert "1" for first two files, "2" for the third
        const out = run(files, { chunkSize: 2 });

        assert.equal(render(out[0]), 'a/b/1/x.txt');
        assert.equal(render(out[1]), 'a/b/1/y.txt');
        assert.equal(render(out[2]), 'a/b/2/z.txt');
    });

    test('unchanged groups preserve identity (copy-on-write only for modified files)', () => {
        const a = file('x/1.txt');
        const b = file('x/2.txt');
        const c = file('y/1.txt');
        const d = file('y/2.txt');

        // chunkSize=3 -> both dirs have only one chunk -> unchanged
        const src = [a, b, c, d];
        const out = run(src, { chunkSize: 3 });

        assert.strictEqual(out[0], a);
        assert.strictEqual(out[1], b);
        assert.strictEqual(out[2], c);
        assert.strictEqual(out[3], d);
        assert.equal(render(out[0]), 'x/1.txt');
        assert.equal(render(out[1]), 'x/2.txt');
        assert.equal(render(out[2]), 'y/1.txt');
        assert.equal(render(out[3]), 'y/2.txt');
    });

    test('degenerate: empty segments arrays are left as-is', () => {
        const f1 = { segments: [] };
        const f2 = { segments: [] };
        const out = run([f1, f2], { chunkSize: 2 });

        assert.strictEqual(out[0], f1);
        assert.strictEqual(out[1], f2);
        assert.equal(render(out[0]), '');
        assert.equal(render(out[1]), '');
    });

    test('zero-padding uses number of chunks (>= 10 yields two digits)', () => {
        // 25 files in same dir; chunkSize=2 -> 13 chunks → 2-digit padding
        const files = Array.from({ length: 25 }, (_, i) => file(`a/${i + 1}.txt`));
        const out = run(files, { chunkSize: 2 });

        // First chunk: "01", 10th chunk: "10", 13th chunk: "13"
        assert.equal(render(out[0]), 'a/01/1.txt');   // file 1
        assert.equal(render(out[1]), 'a/01/2.txt');   // file 2
        // 10th chunk covers files indices 18 & 19 (0-based); i=18 => 19th file
        assert.equal(render(out[18]), 'a/10/19.txt');
        assert.equal(render(out[19]), 'a/10/20.txt');
        // 13th chunk: last single file (25th)
        assert.equal(render(out[24]), 'a/13/25.txt');
    });
};
