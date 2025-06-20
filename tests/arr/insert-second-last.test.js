module.exports = ({ test, assert }) => lib => {

    test('insert at second last position', () => {
        const expected = ['foo', 'bar', 'baz', 'qux'];
        const actual = lib.arr.insertSecondLast(['foo', 'bar', 'qux'], 'baz');
        assert.deepEqual(actual, expected);
    });

    test('inserts at last position when array contains only one item', () => {
        const expected = ['foo', 'bar'];
        const actual = lib.arr.insertSecondLast(['foo'], 'bar');
        assert.deepEqual(actual, expected);
    });

};
