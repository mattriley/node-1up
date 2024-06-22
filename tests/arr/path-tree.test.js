module.exports = ({ test, assert }) => ({ arr }) => {

    test('paths expanded to object hierarchy', () => {
        const actual = arr.pathTree(['foo/bar', 'foo/baz', 'baz/qux']);
        const expected = {
            foo: { bar: {}, baz: {} },
            baz: { qux: {} }
        };
        assert.deepEqual(actual, expected);
    });

};
