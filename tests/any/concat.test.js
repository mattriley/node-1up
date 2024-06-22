module.exports = ({ test, assert }) => ({ any }) => {

    test('undefined and null are filtered out', () => {
        const expected = [];
        const actual = any.concat(undefined, null);
        assert.deepEqual(actual, expected);
    });

    test('typical values', () => {
        const expected = ['a', 1, '', true];
        const actual = any.concat('a', 1, '', true);
        assert.deepEqual(actual, expected);
    });

    test('nested arrays are flattened', () => {
        const expected = ['a', 1, '', true];
        const actual = any.concat(['a', 1], ['', true]);
        assert.deepEqual(actual, expected);
    });


};
