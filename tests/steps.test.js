module.exports = ({ test, assert }) => lib => {

    test('steps', () => {
        const input = ['foo', 'bar', 'baz', 'qux'];
        const expected = [
            ['foo'],
            ['foo', 'bar'],
            ['foo', 'bar', 'baz'],
            ['foo', 'bar', 'baz', 'qux']
        ]
        assert.deepEqual(expected, lib.steps(input));
    });

};
