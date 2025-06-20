module.exports = ({ test, assert }) => lib => {

    test('paths expanded to object hierarchy', () => {
        const actual = lib.path.objectTree(['foo/bar', 'foo/baz', 'baz/qux']);
        const expected = {
            foo: { bar: {}, baz: {} },
            baz: { qux: {} }
        };
        assert.deepEqual(actual, expected);
    });

};
