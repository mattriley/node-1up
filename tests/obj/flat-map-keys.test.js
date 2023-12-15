module.exports = ({ test, assert }) => ({ obj }) => {

    test('flat map keys', () => {
        const input = { a: 1 };
        const expected = { a: 1, b: 1 };
        const actual = obj.flatMapKeys(input, ({ key, val, obj }) => {
            assert.equal(val, 1);
            assert.equal(key, 'a');
            assert.equal(obj, input);
            return [key, 'b'];
        });
        assert.deepEqual(actual, expected);
    });

};
