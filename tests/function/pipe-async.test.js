module.exports = ({ test, assert }) => ({ fun }) => {

    test('pipe async', async () => {
        const expected = 'foo bar baz qux';
        const actual = await fun.pipeAsync([
            async x => x + ' bar',
            async x => x + ' baz',
            async x => x + ' qux'
        ], 'foo');
        assert.deepEqual(actual, expected);
    });

    test('pipe async 2 step', async () => {
        const expected = 'foo bar baz qux';
        const pipe = await fun.pipeAsync([
            async x => x + ' bar',
            async x => x + ' baz',
            async x => x + ' qux'
        ]);
        const actual = await pipe('foo');
        assert.deepEqual(actual, expected);
    });

};
