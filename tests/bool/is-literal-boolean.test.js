module.exports = ({ test, assert }) => lib => {

    // ── positives ────────────────────────────────────────────────────────────
    test("returns true for 'true'", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean('true'), true);
    });

    test("returns true for 'false'", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean('false'), true);
    });

    // ── negatives: casing / whitespace ───────────────────────────────────────
    test("returns false for 'True' (case-sensitive)", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean('True'), false);
    });

    test("returns false for 'FALSE' (case-sensitive)", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean('FALSE'), false);
    });

    test("returns false for ' true ' (leading/trailing spaces)", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean(' true '), false);
    });

    // ── negatives: other strings ─────────────────────────────────────────────
    test("returns false for 'yes'/'no'", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean('yes'), false);
        assert.strictEqual(lib.bool.isLiteralBoolean('no'), false);
    });

    test("returns false for '0'/'1'", () => {
        assert.strictEqual(lib.bool.isLiteralBoolean('0'), false);
        assert.strictEqual(lib.bool.isLiteralBoolean('1'), false);
    });

    test('returns false for empty string', () => {
        assert.strictEqual(lib.bool.isLiteralBoolean(''), false);
    });

    // ── negatives: non-strings ───────────────────────────────────────────────
    test('returns false for booleans (non-string)', () => {
        assert.strictEqual(lib.bool.isLiteralBoolean(true), false);
        assert.strictEqual(lib.bool.isLiteralBoolean(false), false);
    });

    test('returns false for numbers', () => {
        assert.strictEqual(lib.bool.isLiteralBoolean(0), false);
        assert.strictEqual(lib.bool.isLiteralBoolean(1), false);
        assert.strictEqual(lib.bool.isLiteralBoolean(42), false);
    });

    test('returns false for null/undefined', () => {
        assert.strictEqual(lib.bool.isLiteralBoolean(null), false);
        assert.strictEqual(lib.bool.isLiteralBoolean(undefined), false);
    });

    test('returns false for objects/arrays', () => {
        assert.strictEqual(lib.bool.isLiteralBoolean({}), false);
        assert.strictEqual(lib.bool.isLiteralBoolean([]), false);
    });
};
