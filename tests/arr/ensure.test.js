module.exports = ({ test, assert }) => lib => {

    test('array', () => {
        const input = ['foo', 'bar'];
        const actual = lib.arr.ensure(input);
        assert.deepEqual(actual, input);
    });

    test('null', () => {
        const input = null;
        const expected = [];
        const actual = lib.arr.ensure(input);
        assert.deepEqual(actual, expected);
    });

    test('undefined', () => {
        const input = undefined;
        const expected = [];
        const actual = lib.arr.ensure(input);
        assert.deepEqual(actual, expected);
    });

    test('split on default delimiter', () => {
        const input = 'foo,bar';
        const expected = ['foo', 'bar'];
        const actual = lib.arr.ensure(input);
        assert.deepEqual(actual, expected);
    });

    test('split on custom delimiter', () => {
        const input = 'foo|bar';
        const expected = ['foo', 'bar'];
        const actual = lib.arr.ensure(input, '|');
        assert.deepEqual(actual, expected);
    });

    test('split trims and compacts', () => {
        const input = 'foo, bar, ';
        const expected = ['foo', 'bar'];
        const actual = lib.arr.ensure(input, ',');
        assert.deepEqual(actual, expected);
    });

};
