module.exports = ({ test, assert }) => ({ fun }) => {

    test('pipe async', () => {
        const expected = 'foo bar baz qux';
        const pipe = fun.pipe([
            x => x + ' bar',
            x => x + ' baz',
            x => x + ' qux'
        ]);
        const actual = pipe('foo');
        assert.deepEqual(actual, expected);
    });

    test('pipe async', () => {
        const expected = 'foo bar baz qux';
        const actual = fun.pipe([
            x => x + ' bar',
            x => x + ' baz',
            x => x + ' qux'
        ], 'foo');
        assert.deepEqual(actual, expected);
    });

};
