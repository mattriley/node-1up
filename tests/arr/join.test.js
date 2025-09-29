module.exports = ({ test, assert }) => lib => {

    // ── basics ───────────────────────────────────────────────────────────────
    test('default delimiter is comma', () => {
        const expected = 'foo,bar,baz,qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux']);
        assert.deepEqual(actual, expected);
    });

    test('custom delimiter', () => {
        const expected = 'foo | bar | baz | qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], { delimiter: ' | ' });
        assert.deepEqual(actual, expected);
    });

    test('final delimiter (Oxford-style)', () => {
        const expected = 'foo, bar, baz & qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], { delimiter: ', ', finalDelimiter: ' & ' });
        assert.deepEqual(actual, expected);
    });

    test('final delimiter same as delimiter → regular join', () => {
        const expected = 'foo, bar, baz, qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], { delimiter: ', ', finalDelimiter: ', ' });
        assert.deepEqual(actual, expected);
    });

    // ── sizes ────────────────────────────────────────────────────────────────
    test('two items + custom delimiter (no final delimiter)', () => {
        const expected = 'foo | bar';
        const actual = lib.arr.join(['foo', 'bar'], { delimiter: ' | ' });
        assert.deepEqual(actual, expected);
    });

    test('two items + final delimiter', () => {
        const expected = 'foo & bar';
        const actual = lib.arr.join(['foo', 'bar'], { delimiter: ', ', finalDelimiter: ' & ' });
        assert.deepEqual(actual, expected);
    });

    test('single item returns the item stringified', () => {
        const expected = 'foo';
        const actual = lib.arr.join(['foo']);
        assert.deepEqual(actual, expected);
    });

    test('empty array returns empty string', () => {
        const expected = '';
        const actual = lib.arr.join([]);
        assert.deepEqual(actual, expected);
    });

    // ── coercion & nullish entries ───────────────────────────────────────────
    test('non-string values are stringified', () => {
        const expected = '1-true-3';
        const actual = lib.arr.join([1, true, 3], { delimiter: '-' });
        assert.deepEqual(actual, expected);
    });

    test('null/undefined behave like Array.join (become empty tokens)', () => {
        const expected = 'a,,,d';
        const actual = lib.arr.join(['a', null, undefined, 'd'], { delimiter: ',' });
        assert.deepEqual(actual, expected);
    });

    // ── longer list with custom finalDelimiter ───────────────────────────────
    test('final delimiter only applies between the last two items', () => {
        const expected = 'a | b | c | d & e';
        const actual = lib.arr.join(['a', 'b', 'c', 'd', 'e'], { delimiter: ' | ', finalDelimiter: ' & ' });
        assert.deepEqual(actual, expected);
    });

    // ── immutability ────────────────────────────────────────────────────────
    test('does not mutate input array', () => {
        const input = ['x', 'y', 'z'];
        const copy = input.slice();
        void lib.arr.join(input, { delimiter: ', ' });
        assert.deepEqual(input, copy);
    });

};
