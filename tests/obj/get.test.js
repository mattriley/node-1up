module.exports = ({ test, assert }) => ({ obj }) => {

    test('get by string path', () => {
        const expected = 1;
        const actual = obj.get({ foo: { bar: expected } }, 'foo.bar');
        assert.deepEqual(actual, expected);
    });

    test('get by string path where last key containts dot', () => {
        const expected = 1;
        const actual = obj.get({ foo: { 'bar.baz': expected } }, 'foo.bar.baz');
        assert.deepEqual(actual, expected);
    });

    test('get by array path', () => {
        const expected = 1;
        const actual = obj.get({ foo: { bar: expected } }, ['foo', 'bar']);
        assert.deepEqual(actual, expected);
    });

    test('get by array path where last key containts dot', () => {
        const expected = 1;
        const actual = obj.get({ foo: { 'bar.baz': expected } }, ['foo', 'bar.baz']);
        assert.deepEqual(actual, expected);
    });

    test('get by string path', () => {
        const expected = null;
        const actual = obj.get({ foo: {} }, 'foo.bar', expected);
        assert.deepEqual(actual, expected);
    });

};
