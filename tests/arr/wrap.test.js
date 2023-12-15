module.exports = ({ test, assert }) => ({ arr }) => {

    test('limit greater than all item lengths', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 20);
        const expected = [['foo bar', 'baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('limit greater than first item length', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 7);
        const expected = [['foo bar'], ['baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('limit less than first item length', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 5);
        const expected = [['foo bar'], ['baz qux']];
        assert.deepEqual(actual, expected);
    });

};
