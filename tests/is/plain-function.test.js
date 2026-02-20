module.exports = ({ test, assert }) => ({ is }) => {

    test('returns true for arrow function', () => {
        assert.equal(is.plainFunction(() => 1), true);
    });

    test('returns false for regular function declarations', () => {
        function named() { return 1; }
        assert.equal(is.plainFunction(named), false);
    });

    test('returns false for class constructors and non-functions', () => {
        class C {}
        assert.equal(is.plainFunction(C), false);
        assert.equal(is.plainFunction(null), false);
        assert.equal(is.plainFunction({}), false);
    });

};
