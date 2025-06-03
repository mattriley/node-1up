module.exports = ({ test, assert }) => ({ str }) => {

    test('get shortest', () => {
        const actual = str.shortest(['aaa', 'a', 'aa']);
        const expected = 'a';
        assert.equal(actual, expected);
    });

};
