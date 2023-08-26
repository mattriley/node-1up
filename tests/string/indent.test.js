module.exports = ({ test, assert }) => ({ str }) => {

    test('indent with defaults', () => {
        const expected = '    foo';
        const actual = str.indent('foo', 1);
        assert.equal(expected, actual);
    });

    test('indent', () => {
        const expected = '  foo';
        const actual = str.indent('foo', 1, 2);
        assert.equal(expected, actual);
    });

};
