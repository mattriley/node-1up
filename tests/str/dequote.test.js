module.exports = ({ test, assert }) => ({ str }) => {

    test('removes matching quote delimiters', () => {
        const actual = str.dequote('"hello"');
        const expected = 'hello';
        assert.equal(actual, expected);
    });

    test('returns input unchanged when delimiters do not match', () => {
        const actual = str.dequote('"hello');
        const expected = '"hello';
        assert.equal(actual, expected);
    });

    test('supports allowEscaped option', () => {
        const actual = str.dequote('\\"hello\\"', '"', { allowEscaped: true });
        const expected = 'hello';
        assert.equal(actual, expected);
    });

};
