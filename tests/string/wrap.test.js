module.exports = ({ test, assert }) => ({ str }) => {

    test('wrap', () => {
        const actual = str.wrap('foo bar baz qux', 7);
        const expected = 'foo bar\nbaz qux';
        assert.equal(expected, actual);
    });

    test('wrap', () => {
        const actual = str.wrap('foo bar baz qux', 5);
        const expected = 'foo\nbar\nbaz\nqux';
        assert.equal(expected, actual);
    });

};
