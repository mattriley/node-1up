module.exports = ({ test, assert }) => lib => {

    test('default separator is comma', () => {
        const expected = 'foo,bar,baz,qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux']);
        assert.deepEqual(actual, expected);
    });

    test('custom separator', () => {
        const expected = 'foo | bar | baz | qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], ' | ');
        assert.deepEqual(actual, expected);
    });

    test('final separator', () => {
        const expected = 'foo, bar, baz & qux';
        const actual = lib.arr.join(['foo', 'bar', 'baz', 'qux'], ', ', ' & ');
        assert.deepEqual(actual, expected);
    });

    test('final separator on only two items', () => {
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
