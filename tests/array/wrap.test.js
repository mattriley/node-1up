module.exports = ({ test, assert }) => ({ arr }) => {

    test('wrap', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 20);
        const expected = [['foo bar', 'baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('wrap', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 7);
        const expected = [['foo bar'], ['baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('wrap on word', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 5);
        const expected = [['foo bar'], ['baz qux']];
        assert.deepEqual(actual, expected);
    });

};
