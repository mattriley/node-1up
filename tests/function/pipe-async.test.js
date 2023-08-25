module.exports = ({ test, assert }) => ({ fun }) => {

    test('pipe async', async () => {
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
