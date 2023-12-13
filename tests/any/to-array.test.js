module.exports = ({ test, assert }) => ({ any }) => {

    test('undefined', () => {
        const input = undefined;
        const expected = [];
        const actual = any.toArray(input);
        assert.deepEqual(actual, expected);
    });

    test('non-array', () => {
        const input = 'a';
        const expected = ['a'];
        const actual = any.toArray(input);
        assert.deepEqual(actual, expected);
    });

    test('array', () => {
        const input = ['a'];
        const expected = ['a'];
        const actual = any.toArray(input);
        assert.deepEqual(actual, expected);
    });

    test('nested array', () => {
        const input = [['a']];
        const expected = [['a']];
        const actual = any.toArray(input);
        assert.deepEqual(actual, expected);
    });

};
