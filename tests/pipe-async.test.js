module.exports = ({ test, assert }) => lib => {

    test('pipe async', async () => {
        const expected = 'foo bar baz qux';
        const pipe = await lib.pipeAsync([
            async x => x + ' bar',
            async x => x + ' baz',
            async x => x + ' qux'
        ]);
        const actual = await pipe('foo');
        assert.deepEqual(actual, expected);
    });

};
