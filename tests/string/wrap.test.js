module.exports = ({ test, assert }) => ({ str }) => {

    test('wrap on space', () => {
        const actual = str.wrap('foo bar baz qux', 7);
        const expected = 'foo bar\nbaz qux';
        assert.equal(actual, expected);
    });

    test('wrap on word', () => {
        const actual = str.wrap('foo bar baz qux', 5);
        const expected = 'foo\nbar\nbaz\nqux';
        assert.equal(actual, expected);
    });

};
