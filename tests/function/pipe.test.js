module.exports = ({ test, assert }) => ({ fun }) => {

    test('pipe', () => {
        const expected = 'foo bar baz qux';
        const actual = fun.pipe([
            x => x + ' bar',
            x => x + ' baz',
            x => x + ' qux'
        ], 'foo');
        assert.deepEqual(actual, expected);
    });

    test('pipe 2 step', () => {
        const expected = 'foo bar baz qux';
        const pipe = fun.pipe([
            x => x + ' bar',
            x => x + ' baz',
            x => x + ' qux'
        ]);
        const actual = pipe('foo');
        assert.deepEqual(actual, expected);
    });

};
