module.exports = ({ test, assert }) => ({ obj }) => {

    test('map keys', () => {
        const input = { foo: 'bar' };
        const expected = { FOO: 'bar' };
        const actual = obj.mapKeys(input, ({ key, val, obj }) => {
            assert.equal(val, 'bar');
            assert.equal(key, 'foo');
            assert.equal(obj, input);
            return 'FOO';
        });
        assert.deepEqual(actual, expected);
    });

};
