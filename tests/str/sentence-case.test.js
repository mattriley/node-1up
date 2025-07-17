module.exports = ({ test, assert }) => ({ str }) => {

    test('sentence case', () => {
        const expected = 'Foo bar';
        const actual = str.sentenceCase('fooBar');
        assert.equal(actual, expected);
    });


};
