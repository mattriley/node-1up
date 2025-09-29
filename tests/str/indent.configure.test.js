module.exports = ({ test, assert }) => ({ str }) => {

    test('indent with defaults', () => {
        const indenter = str.indent.configure();
        const expected = '    foo';
        const actual = indenter('foo');
        assert.equal(actual, expected);
    });

    test('indent with custom size', () => {
        const indenter = str.indent.configure({ size: 2 });
        const expected = '  foo';
        const actual = indenter('foo');
        assert.equal(actual, expected);
    });

    test('indent with custom depth', () => {
        const indenter = str.indent.configure({ depth: 3 });
        const expected = '            foo'; // 3 * 4 spaces
        const actual = indenter('foo');
        assert.equal(actual, expected);
    });

    test('indent with custom depth and size', () => {
        const indenter = str.indent.configure({ depth: 2, size: 3 });
        const expected = '      foo'; // 2 * 3 spaces
        const actual = indenter('foo');
        assert.equal(actual, expected);
    });

    test('indent overrides depth and size when calling function', () => {
        const indenter = str.indent.configure({ depth: 2, size: 3 });
        const expected = '  foo'; // 1 * 2 spaces
        const actual = indenter('foo', { depth: 1, size: 2 });
        assert.equal(actual, expected);
    });

};
