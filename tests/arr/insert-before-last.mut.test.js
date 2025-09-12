module.exports = ({ test, assert }) => lib => {

    const fn = lib.arr.insertBeforeLast.configure({ mutate: true });

    test('insert at second last position', () => {
        const input = ['foo', 'bar', 'qux'];
        const expected = ['foo', 'bar', 'baz', 'qux'];
        const actual = fn(input, 'baz');
        assert.deepEqual(actual, expected);
        assert.equal(actual, input);
    });

    test('inserts at last position when array contains only one item', () => {
        const input = ['foo'];
        const expected = ['foo', 'bar'];
        const actual = fn(input, 'bar');
        assert.deepEqual(actual, expected);
        assert.equal(actual, input);
    });

};
