module.exports = ({ test, assert }) => lib => {

    // ── positives ────────────────────────────────────────────────────────────
    test('returns true for \'true\'', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean('true'), true);
    });

    test('returns false for \'false\'', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean('false'), false);
    });

    // ── negatives: casing and whitespace ─────────────────────────────────────
    test('returns undefined for \'True\' (case-sensitive)', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean('True'), undefined);
    });

    test('returns undefined for \' FALSE \' (extra spaces)', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean(' FALSE '), undefined);
    });

    // ── non-boolean strings ──────────────────────────────────────────────────
    test('returns undefined for \'yes\'/\'no\'', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean('yes'), undefined);
        assert.strictEqual(lib.bool.parseLiteralBoolean('no'), undefined);
    });

    test('returns undefined for empty string', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean(''), undefined);
    });

    test('returns undefined for arbitrary strings', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean('foo'), undefined);
        assert.strictEqual(lib.bool.parseLiteralBoolean('0'), undefined);
        assert.strictEqual(lib.bool.parseLiteralBoolean('1'), undefined);
    });

    // ── non-string inputs (coerced with toString) ────────────────────────────
    test('returns true for Boolean true (coerced to "true")', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean(true), true);
    });

    test('returns false for Boolean false (coerced to "false")', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean(false), false);
    });

    test('returns undefined for numbers', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean(0), undefined);
        assert.strictEqual(lib.bool.parseLiteralBoolean(1), undefined);
        assert.strictEqual(lib.bool.parseLiteralBoolean(42), undefined);
    });

    test('returns undefined for null/undefined', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean(null), undefined);       // "null"
        assert.strictEqual(lib.bool.parseLiteralBoolean(undefined), undefined); // "undefined"
    });

    test('returns undefined for objects/arrays', () => {
        assert.strictEqual(lib.bool.parseLiteralBoolean({}), undefined); // "[object Object]"
        assert.strictEqual(lib.bool.parseLiteralBoolean([]), undefined); // ""
    });

};
