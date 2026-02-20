module.exports = ({ test, assert }) => ({ is }) => {

    test('returns true for plain object literal', () => {
        assert.equal(is.plainObject({ a: 1 }), true);
    });

    test('returns false for null, arrays, and custom prototypes', () => {
        assert.equal(is.plainObject(null), false);
        assert.equal(is.plainObject([]), false);
        assert.equal(is.plainObject(Object.create(null)), false);
        assert.equal(is.plainObject(new Date()), false);
    });

};
