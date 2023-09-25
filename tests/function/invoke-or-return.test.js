module.exports = ({ test, assert }) => ({ f }) => {

    test('invoke', () => {
        const args = ['foo', 'bar'];
        const val = (...args) => args.join('');
        const actual = f.invokeOrReturn(val, ...args);
        assert.equal(actual, 'foobar');
    });

};
