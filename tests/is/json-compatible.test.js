module.exports = ({ test, assert }) => ({ is }) => {

    test('returns true for JSON-compatible primitives and structures', () => {
        assert.equal(is.jsonCompatible(null), true);
        assert.equal(is.jsonCompatible(true), true);
        assert.equal(is.jsonCompatible(1), true);
        assert.equal(is.jsonCompatible('x'), true);
        assert.equal(is.jsonCompatible([1, 2, 3]), true);
        assert.equal(is.jsonCompatible({ a: 1 }), true);
    });

    test('returns false for non-JSON-compatible values', () => {
        assert.equal(is.jsonCompatible(Symbol('x')), false);
        assert.equal(is.jsonCompatible(() => {}), false);
        assert.equal(is.jsonCompatible(BigInt(1)), false);
        assert.equal(is.jsonCompatible(new Date()), false);
    });

};
