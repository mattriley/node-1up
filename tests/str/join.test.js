module.exports = ({ test, assert }) => ({ str }) => {

    test('defaults with single element', () => {
        const actual = str.join(['foo']);
        const expected = 'foo';
        assert.equal(actual, expected);
    });

    test('defaults with two elements', () => {
        const actual = str.join(['foo', 'bar']);
        const expected = 'foo & bar';
        assert.equal(actual, expected);
    });

    test('defaults with three elements', () => {
        const actual = str.join(['foo', 'bar', 'baz']);
        const expected = 'foo, bar & baz';
        assert.equal(actual, expected);
    });

    test('options with three elements', () => {
        const actual = str.join(['foo', 'bar', 'baz'], '; ', ' and ');
        const expected = 'foo; bar and baz';
        assert.equal(actual, expected);
    });

};
