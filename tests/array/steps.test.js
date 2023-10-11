module.exports = ({ test, assert }) => ({ arr }) => {

    test('steps', () => {
        const input = ['foo', 'bar', 'baz', 'qux'];
        const expected = [
            ['foo'],
            ['foo', 'bar'],
            ['foo', 'bar', 'baz'],
            ['foo', 'bar', 'baz', 'qux']
        ];
        const actual = arr.steps(input);
        assert.deepEqual(actual, expected);
    });

};
