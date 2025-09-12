module.exports = ({ test, assert }) => lib => {

    // ── immutable (default) behavior ─────────────────────────────────────────

    test('immutable: deduplicates adjacent values', () => {
        const input = ['a', 'b', 'b', 'c', 'b'];
        const out = lib.arr.dedupeAdjacent(input);
        assert.deepEqual(out, ['a', 'b', 'c', 'b']);
    });

    test('immutable: handles empty array', () => {
        const out = lib.arr.dedupeAdjacent([]);
        assert.deepEqual(out, []);
    });

    test('immutable: single element returns copy with same element', () => {
        const out = lib.arr.dedupeAdjacent(['a']);
        assert.deepEqual(out, ['a']);
    });

    test('immutable: removes all but one when all values are identical', () => {
        const out = lib.arr.dedupeAdjacent(['x', 'x', 'x', 'x']);
        assert.deepEqual(out, ['x']);
    });

    test('immutable: leaves array unchanged when no adjacent duplicates', () => {
        const input = ['a', 'b', 'c', 'd'];
        const out = lib.arr.dedupeAdjacent(input);
        assert.deepEqual(out, ['a', 'b', 'c', 'd']);
    });

    test('immutable: does not mutate input array', () => {
        const input = ['x', 'y', 'y', 'z'];
        const copy = input.slice();
        void lib.arr.dedupeAdjacent(input);
        assert.deepEqual(input, copy);
    });


    // ── default equality uses Object.is semantics ────────────────────────────

    test('Object.is semantics: adjacent NaN values dedupe to one NaN', () => {
        const input = [NaN, NaN, 1];
        const out = lib.arr.dedupeAdjacent(input);
        assert.equal(out.length, 2);
        assert.ok(Number.isNaN(out[0]));
        assert.equal(out[1], 1);
    });

    test('Object.is semantics: 0 and -0 are different (no cross-dedupe)', () => {
        const input = [0, -0, -0, 0];
        const out = lib.arr.dedupeAdjacent(input);
        // only the adjacent -0s dedupe; 0 vs -0 remain distinct
        assert.equal(out.length, 3);
        assert.equal(out[0], 0);
        assert.equal(Object.is(out[1], -0), true); // keep a single -0
        assert.equal(out[2], 0);
    });


    // ── custom comparator via options/config ─────────────────────────────────

    test('custom equal comparator (===): adjacent NaN do NOT dedupe', () => {
        const input = [NaN, NaN, NaN];
        const out = lib.arr.dedupeAdjacent(input, { equal: (a, b) => a === b });
        // with ===, NaN !== NaN, so nothing is removed
        assert.equal(out.length, 3);
        assert.ok(Number.isNaN(out[0]) && Number.isNaN(out[1]) && Number.isNaN(out[2]));
    });

    test('custom equal comparator (case-insensitive strings)', () => {
        const input = ['A', 'a', 'B', 'b', 'b'];
        const out = lib.arr.dedupeAdjacent(input, {
            equal: (a, b) => String(a).toLowerCase() === String(b).toLowerCase()
        });
        // 'A' with 'a' dedupes; 'B' with 'b' and 'b' dedupe → keep first of each run
        assert.deepEqual(out, ['A', 'B']);
    });


    // ── mutate: true (in-place) behavior ─────────────────────────────────────

    test('mutate: deduplicates in place and returns the same reference', () => {
        const input = ['a', 'b', 'b', 'c', 'b'];
        const out = lib.arr.dedupeAdjacent(input, { mutate: true });
        assert.strictEqual(out, input);
        assert.deepEqual(input, ['a', 'b', 'c', 'b']);
    });

    test('mutate: empty array stays same reference and empty', () => {
        const input = [];
        const out = lib.arr.dedupeAdjacent(input, { mutate: true });
        assert.strictEqual(out, input);
        assert.deepEqual(input, []);
    });

    test('mutate: single element stays same reference and unchanged', () => {
        const input = ['x'];
        const out = lib.arr.dedupeAdjacent(input, { mutate: true });
        assert.strictEqual(out, input);
        assert.deepEqual(input, ['x']);
    });

    test('mutate: with Object.is semantics for special numbers', () => {
        const input = [0, -0, -0, 0];
        const out = lib.arr.dedupeAdjacent(input, { mutate: true });
        assert.strictEqual(out, input);
        assert.equal(out.length, 3);
        assert.equal(out[0], 0);
        assert.equal(Object.is(out[1], -0), true);
        assert.equal(out[2], 0);
    });

};
