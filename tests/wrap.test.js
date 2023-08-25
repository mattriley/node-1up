module.exports = ({ test, assert }) => lib => {

    test('wrap', () => {
        const actual = lib.wrap('foo bar baz qux', 7);
        const expected = 'foo bar\nbaz qux';
        assert.equal(expected, actual);
    });

    test('wrap', () => {
        const actual = lib.wrap('foo bar baz qux', 5);
        const expected = 'foo\nbar\nbaz\nqux';
        assert.equal(expected, actual);
    });

};
