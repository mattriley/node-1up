module.exports = ({ test, assert }) => lib => {

    const fn = lib.arr.dedupeAdjacentMut

    test('deduplicates adjacent values in place', () => {
        const input = ['a', 'b', 'b', 'c', 'b'];
        const expected = ['a', 'b', 'c', 'b'];
        const returned = fn(input);
        assert.strictEqual(returned, input); // should be the same array
        assert.deepEqual(input, expected);
    });

    test('handles empty array in place', () => {
        const input = [];
        const returned = fn(input);
        assert.strictEqual(returned, input);
        assert.deepEqual(input, []);
    });

    test('leaves single-element array unchanged', () => {
        const input = ['x'];
        const returned = fn(input);
        assert.strictEqual(returned, input);
        assert.deepEqual(input, ['x']);
    });

    test('removes all but one when all elements are the same', () => {
        const input = ['x', 'x', 'x', 'x'];
        const expected = ['x'];
        const returned = fn(input);
        assert.strictEqual(returned, input);
        assert.deepEqual(input, expected);
    });

    test('does not alter array with no adjacent duplicates', () => {
        const input = ['a', 'b', 'c', 'd'];
        const copy = [...input]; // to compare later
        const returned = fn(input);
        assert.strictEqual(returned, input);
        assert.deepEqual(input, copy);
    });

    test('removes adjacent repeats at start and end in place', () => {
        const input = ['z', 'z', 'a', 'b', 'b', 'z', 'z'];
        const expected = ['z', 'a', 'b', 'z'];
        const returned = fn(input);
        assert.strictEqual(returned, input);
        assert.deepEqual(input, expected);
    });

};
