module.exports = ({ test, assert }) => ({ arr }) => {

    test('remove repeats', () => {
        const input = ['a', 'b', 'b', 'c', 'b'];
        const expected = ['a', 'b', 'c', 'b'];
        const actual = arr.removeRepeats(input);
        assert.deepEqual(actual, expected);
    });

};
