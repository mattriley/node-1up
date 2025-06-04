module.exports = ({ test, assert }) => ({ obj }) => {

    test('transform named entries', () => {
        const input = { foo: 1 };
        const expected = { foo: 2 };
        const actual = obj.transformNamedEntries('key:val', input, entries => {
            assert.equal(entries.length, 1);
            const { key, val } = entries[0];
            return [[key, val + 1]];
        });
        assert.deepEqual(actual, expected);
    });

};
