module.exports = ({ test, assert }) => lib => {

    test('insert at second last position', () => {
        const input = ['foo', 'bar', 'qux'];
        const expected = ['foo', 'bar', 'baz', 'qux'];
        const actual = lib.arr.insertBeforeLastInPlace(input, 'baz');
        assert.deepEqual(actual, expected);
        assert.equal(actual, input);
    });

    test('inserts at last position when array contains only one item', () => {
        const input = ['foo'];
        const expected = ['foo', 'bar'];
        const actual = lib.arr.insertBeforeLastInPlace(input, 'bar');
        assert.deepEqual(actual, expected);
        assert.equal(actual, input);
    });

};
