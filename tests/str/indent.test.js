module.exports = ({ test, assert }) => ({ str }) => {

    test('indent with defaults', () => {
        const expected = '    foo';
        const actual = str.indent('foo', 1);
        assert.equal(actual, expected);
    });

    test('indent', () => {
        const expected = '  foo';
        const actual = str.indent('foo', 1, 2);
        assert.equal(actual, expected);
    });

};
