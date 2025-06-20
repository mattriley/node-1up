module.exports = ({ test, assert }) => lib => {

    test('remove repeats', () => {
        const input = ['a', 'b', 'b', 'c', 'b'];
        const expected = ['a', 'b', 'c', 'b'];
        const actual = lib.arr.dedupeAdjacent(input);
        assert.deepEqual(actual, expected);
    });

};
