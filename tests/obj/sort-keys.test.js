module.exports = ({ test, assert }) => ({ obj }) => {

    test('sort keys', () => {
        const input = { b: 2, c: 3, a: 1 };
        const expected = { a: 1, b: 2, c: 3 };
        const actual = obj.sortKeys(input);
        assert.deepEqual(actual, expected);
    });

};
