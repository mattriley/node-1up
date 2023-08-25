module.exports = ({ test, assert }) => lib => {

    test('indent', () => {
        const expected = '    foo';
        const actual = lib.indent('foo', 1, 4);
        assert.equal(expected, actual);
    });

};
