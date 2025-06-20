// Tests expanded with help from ChatGPT on 21 June 2025.

module.exports = ({ test, assert }) => lib => {

    test('deduplicates adjacent values', () => {
        const input = ['a', 'b', 'b', 'c', 'b'];
        const expected = ['a', 'b', 'c', 'b'];
        const actual = lib.arr.dedupeAdjacent(input);
        assert.deepEqual(actual, expected);
    });

    test('handles empty array', () => {
        const actual = lib.arr.dedupeAdjacent([]);
        assert.deepEqual(actual, []);
    });

    test('removes all but one when all values are identical', () => {
        const actual = lib.arr.dedupeAdjacent(['x', 'x', 'x', 'x']);
        assert.deepEqual(actual, ['x']);
    });

    test('leaves array unchanged when no adjacent duplicates', () => {
        const input = ['a', 'b', 'c', 'd'];
        const actual = lib.arr.dedupeAdjacent(input);
        assert.deepEqual(actual, ['a', 'b', 'c', 'd']);
    });

    test('returns same array when only one element', () => {
        const actual = lib.arr.dedupeAdjacent(['a']);
        assert.deepEqual(actual, ['a']);
    });

    test('removes adjacent repeats at start and end', () => {
        const input = ['z', 'z', 'a', 'b', 'b', 'z', 'z'];
        const expected = ['z', 'a', 'b', 'z'];
        const actual = lib.arr.dedupeAdjacent(input);
        assert.deepEqual(actual, expected);
    });

};
