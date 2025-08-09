module.exports = ({ test, assert }) => ({ str }) => {

    test('removes quotes with default config', () => {
        const unquote = str.configure.dequote(); // replace with actual exported name
        const actual = unquote('"hello"');
        const expected = 'hello';
        assert.equal(actual, expected);
    });

    test('returns unchanged if no surrounding quotes', () => {
        const unquote = str.configure.dequote();
        const actual = unquote('hello');
        const expected = 'hello';
        assert.equal(actual, expected);
    });

    test('handles custom delimiter', () => {
        const unquote = str.configure.dequote({ delimiter: "'" });
        const actual = unquote("'world'");
        const expected = 'world';
        assert.equal(actual, expected);
    });

    test('throws error if delimiter is invalid', () => {
        const unquote = str.configure.dequote();
        assert.throws(() => unquote('"test"', 'ab'), TypeError);
        assert.throws(() => unquote('"test"', ''), TypeError);
        assert.throws(() => unquote('"test"', 1), TypeError);
    });

    test('returns unchanged if input is not a string', () => {
        const unquote = str.configure.dequote();
        assert.equal(unquote(123), 123);
        assert.equal(unquote(null), null);
        assert.equal(unquote(undefined), undefined);
    });

    test('removes escaped quotes when allowEscaped = true (config)', () => {
        const unquote = str.configure.dequote({ allowEscaped: true });
        const actual = unquote('\\"foo\\"');
        const expected = 'foo';
        assert.equal(actual, expected);
    });

    test('removes escaped quotes when allowEscaped = true (per call)', () => {
        const unquote = str.configure.dequote();
        const actual = unquote('\\"bar\\"', '"', { allowEscaped: true });
        const expected = 'bar';
        assert.equal(actual, expected);
    });

    test('returns unchanged if escaped quotes but allowEscaped = false', () => {
        const unquote = str.configure.dequote();
        const actual = unquote('\\"baz\\"');
        const expected = '\\"baz\\"';
        assert.equal(actual, expected);
    });

};
