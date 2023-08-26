module.exports = ({ test, assert }) => ({ obj }) => {

    test('map values', () => {
        const input = { foo: 'bar' };
        const expected = { foo: 'BAR' };
        const actual = obj.mapValues(input, (key, val, obj) => {
            assert.equal(key, 'foo');
            assert.equal(val, 'bar');
            assert.equal(obj, input);
            return 'BAR';
        });
        assert.deepEqual(actual, expected);
    });

};
