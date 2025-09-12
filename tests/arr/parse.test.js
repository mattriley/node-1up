module.exports = ({ test, assert }) => lib => {

    // ── arrays ────────────────────────────────────────────────────────────────
    test('array → returned as-is (same reference)', () => {
        const input = ['foo', 'bar'];
        const actual = lib.arr.parse(input, ',');
        assert.strictEqual(actual, input);
    });

    test('array is unaffected by delimiter choice', () => {
        const input = ['foo', 'bar'];
        const actual = lib.arr.parse(input, '|');
        assert.strictEqual(actual, input);
    });

    // ── nullish ──────────────────────────────────────────────────────────────
    test('null → []', () => {
        const actual = lib.arr.parse(null, ',');
        assert.deepEqual(actual, []);
    });

    test('undefined → []', () => {
        const actual = lib.arr.parse(undefined, ',');
        assert.deepEqual(actual, []);
    });

    // ── basic splitting ──────────────────────────────────────────────────────
    test('split on provided delimiter (string)', () => {
        const actual = lib.arr.parse('foo,bar', ',');
        assert.deepEqual(actual, ['foo', 'bar']);
    });

    test('split trims tokens and compacts empties', () => {
        const actual = lib.arr.parse('  foo ,  bar ,   ', ',');
        assert.deepEqual(actual, ['foo', 'bar']);
    });

    test('no delimiter present → single trimmed token', () => {
        const actual = lib.arr.parse('  foobar  ', ',');
        assert.deepEqual(actual, ['foobar']);
    });

    test('whitespace-only string → []', () => {
        const actual = lib.arr.parse('   ', ',');
        assert.deepEqual(actual, []);
    });

    // ── non-string inputs ────────────────────────────────────────────────────
    test('number is coerced then split', () => {
        const actual = lib.arr.parse(42, ',');
        assert.deepEqual(actual, ['42']);
    });

    test('boolean is coerced then split', () => {
        const actual = lib.arr.parse(true, ',');
        assert.deepEqual(actual, ['true']);
    });

    test('empty string → []', () => {
        const actual = lib.arr.parse('', ',');
        assert.deepEqual(actual, []);
    });

    // ── RegExp delimiter support (if parseOptions forwards as-is) ────────────
    test('RegExp delimiter works', () => {
        const actual = lib.arr.parse('foo | bar, baz', /[|,]/);
        // note: inner trim removes surrounding spaces
        assert.deepEqual(actual, ['foo', 'bar', 'baz']);
    });

    // ── immutability / independence ──────────────────────────────────────────
    test('does not mutate provided array', () => {
        const input = ['x', 'y'];
        const copy = input.slice();
        void lib.arr.parse(input, ',');
        assert.deepEqual(input, copy);
    });
};
