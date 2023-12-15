module.exports = ({ test, assert }) => ({ str }) => {

    test('limit greater than first two item lengths', () => {
        const actual = str.wrap('foo bar baz qux', 7);
        const expected = 'foo bar\nbaz qux';
        assert.equal(actual, expected);
    });

    test('limit less than first two item lengths', () => {
        const actual = str.wrap('foo bar baz qux', 5);
        const expected = 'foo\nbar\nbaz\nqux';
        assert.equal(actual, expected);
    });

};
