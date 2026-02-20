module.exports = ({ test, assert }) => ({ str }) => {

    test('joins with default delimiters', () => {
        const actual = str.join(['apple', 'banana', 'cherry']);
        const expected = 'apple, banana & cherry';
        assert.equal(actual, expected);
    });

    test('supports per-call custom delimiters', () => {
        const actual = str.join(['a', 'b', 'c'], ', ', ' and ');
        const expected = 'a, b and c';
        assert.equal(actual, expected);
    });

};
