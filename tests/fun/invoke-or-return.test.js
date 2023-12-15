module.exports = ({ test, assert }) => ({ fun }) => {

    test('invoke', () => {
        const args = ['foo', 'bar'];
        const val = (...args) => args.join('');
        const actual = fun.invokeOrReturn(val, ...args);
        assert.equal(actual, 'foobar');
    });

};
