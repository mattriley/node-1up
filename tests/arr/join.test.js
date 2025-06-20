module.exports = ({ test, assert }) => lib => {

    test('default delimiter is comma', () => {
        const expected = 'foo,bar,baz,qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux']);
        assert.deepEqual(actual, expected);
    });

    test('custom delimiter', () => {
        const expected = 'foo | bar | baz | qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], ' | ');
        assert.deepEqual(actual, expected);
    });

    test('final delimiter', () => {
        const expected = 'foo, bar, baz & qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], ', ', ' & ');
        assert.deepEqual(actual, expected);
    });

    test('final delimiter on only two items', () => {
        const expected = 'foo & bar';
        const actual = lib.arr.join(['foo', 'bar'], ', ', ' & ');
        assert.deepEqual(actual, expected);
    });

    test('empty array', () => {
        const expected = '';
        const actual = lib.arr.join([]);
        assert.deepEqual(actual, expected);
    });


};
