module.exports = ({ test, assert }) => lib => {

    // ── no predicate ─────────────────────────────────────────────────────────
    test('no predicate: single element → value', () => {
        const input = ['only'];
        const actual = lib.arr.only(input);
        assert.strictEqual(actual, 'only');
    });

    test('no predicate: empty → null', () => {
        const actual = lib.arr.only([]);
        assert.strictEqual(actual, null);
    });

    test('no predicate: multiple → null', () => {
        const actual = lib.arr.only(['a', 'b']);
        assert.strictEqual(actual, null);
    });

    // ── with predicate ───────────────────────────────────────────────────────
    test('predicate: exactly one match → that value', () => {
        const input = [1, 2, 3];
        const actual = lib.arr.only(input, x => x === 2);
        assert.strictEqual(actual, 2);
    });

    test('predicate: zero matches → null', () => {
        const input = [1, 3, 5];
        const actual = lib.arr.only(input, x => x % 2 === 0);
        assert.strictEqual(actual, null);
    });

    test('predicate: multiple matches → null', () => {
        const input = [2, 4, 6];
        const actual = lib.arr.only(input, x => x % 2 === 0);
        assert.strictEqual(actual, null);
    });

    test('predicate receives (value, index, list)', () => {
        const input = ['a', 'b', 'c'];
        let seenArgs;
        const pred = (v, i, arr) => {
            if (!seenArgs) seenArgs = [v, i, arr];
            return v === 'b';
        };
        void lib.arr.only(input, pred);
        assert.strictEqual(seenArgs[0], 'a');
        assert.strictEqual(seenArgs[1], 0);
        assert.strictEqual(seenArgs[2], input);
    });

    // ── reference / immutability ────────────────────────────────────────────
    test('does not mutate the input array', () => {
        const input = [{ id: 1 }, { id: 2 }];
        const copy = input.slice();
        void lib.arr.only(input, x => x.id === 1);
        assert.deepEqual(input, copy);
    });

    test('returns the same object reference (not a clone)', () => {
        const o = { id: 42 };
        const input = [o];
        const actual = lib.arr.only(input);
        assert.strictEqual(actual, o);
    });
};
