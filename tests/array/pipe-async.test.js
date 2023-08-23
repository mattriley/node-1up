module.exports = ({ test, assert, main }) => {

    test('pipe async', async () => {
        const expected = 'foo bar baz qux';
        const actual = await main.array.pipeAsync([
            async x => x + ' bar',
            async x => x + ' baz',
            async x => x + ' qux'
        ])('foo');
        assert.deepEqual(actual, expected);
    });

};
