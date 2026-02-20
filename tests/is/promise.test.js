module.exports = ({ test, assert }) => ({ is }) => {

    test('returns true for native promises', () => {
        assert.equal(is.promise(Promise.resolve(1)), true);
    });

    test('returns true for thenables and false otherwise', () => {
        assert.equal(is.promise({ then: () => {} }), true);
        assert.equal(is.promise({ then: 1 }), false);
        assert.equal(is.promise(undefined), undefined);
        assert.equal(is.promise(null), null);
    });

};
