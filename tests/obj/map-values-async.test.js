module.exports = ({ test, assert }) => ({ obj }) => {

    test('map values async', async () => {
        const input = { foo: 'bar' };
        const expected = { foo: 'BAR' };
        const actual = await obj.mapValuesAsync(input, async ({ key, val, obj }) => {
            assert.equal(key, 'foo');
            assert.equal(val, 'bar');
            assert.equal(obj, input);
            return 'BAR';
        });
        assert.deepEqual(actual, expected);
    });

};
