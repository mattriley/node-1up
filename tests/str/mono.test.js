module.exports = ({ test, assert }) => ({ str }) => {

    test('get mono', () => {
        const actual = str.mono('aA1');
        const expected = '𝚊𝙰𝟷';
        assert.equal(actual, expected);
    });

};
