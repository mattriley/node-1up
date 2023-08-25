module.exports = ({ test, assert }) => ({ str }) => {

    test('indent', () => {
        const expected = '    foo';
        const actual = str.indent('foo', 1, 4);
        assert.equal(expected, actual);
    });

};
