module.exports = ({ test, assert }) => ({ str }) => {

    test('indents with defaults', () => {
        const actual = str.indent('line');
        const expected = '    line';
        assert.equal(actual, expected);
    });

    test('supports custom indentation options', () => {
        const actual = str.indent('line', { char: '-', size: 2, depth: 3 });
        const expected = '------line';
        assert.equal(actual, expected);
    });

};
