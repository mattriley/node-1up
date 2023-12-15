module.exports = ({ test, assert }) => ({ arr }) => {

    test('array', () => {
        const input = ['foo', 'bar'];
        const actual = arr.arrayOrSplit(input);
        assert.deepEqual(actual, input);
    });

    test('falsey', () => {
        const input = null;
        const expected = [];
        const actual = arr.arrayOrSplit(input);
        assert.deepEqual(actual, expected);
    });

    test('split on default delimiter', () => {
        const input = 'foo,bar';
        const expected = ['foo', 'bar'];
        const actual = arr.arrayOrSplit(input);
        assert.deepEqual(actual, expected);
    });

    test('split on custom delimiter', () => {
        const input = 'foo|bar';
        const expected = ['foo', 'bar'];
        const actual = arr.arrayOrSplit(input, '|');
        assert.deepEqual(actual, expected);
    });

    test('split trims and compacts', () => {
        const input = 'foo, bar, ';
        const expected = ['foo', 'bar'];
        const actual = arr.arrayOrSplit(input, ',');
        assert.deepEqual(actual, expected);
    });

};
