module.exports = ({ test, assert }) => ({ str }) => {

    test('pad no zero', () => {
        const actual = str.padZero(9, 9);
        const expected = '9';
        assert.equal(actual, expected);
    });

    test('pad one zero', () => {
        const actual = str.padZero(9, 99);
        const expected = '09';
        assert.equal(actual, expected);
    });

    test('pad two zeros', () => {
        const actual = str.padZero(9, 999);
        const expected = '009';
        assert.equal(actual, expected);
    });

};
