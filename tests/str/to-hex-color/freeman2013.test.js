module.exports = ({ test, assert }) => ({ str }) => {

    test('color for foobar', () => {
        const expected = '#8d715e';
        const actual = str.toHexColor.freeman2013('foobar');
        assert.equal(actual, expected);
    });

};
