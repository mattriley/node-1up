// tests/pipe/merge.test.js
module.exports = ({ test, assert }) => lib => {

    const pipeMerge = lib.pipe.merge; // default: immediate (defer: false)

    // ----- Immediate (default) -----

    test('pipeMerge (immediate): array of functions merges outputs', () => {
        const result = pipeMerge([
            () => ({ a: 1 }),
            () => ({ b: 2 }),
            () => ({ c: 3 })
        ], {}); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeMerge (immediate): object of functions merges outputs', () => {
        const result = pipeMerge({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        }, {}); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge (immediate): initial value is used and preserved', () => {
        const result = pipeMerge([
            () => ({ b: 2 })
        ], { a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge (immediate): empty array returns initial unchanged', () => {
        const result = pipeMerge([], { a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeMerge (immediate): functions can overwrite earlier keys', () => {
        const result = pipeMerge([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ], {});
        assert.deepStrictEqual(result, { a: 2 });
    });

    // ----- Errors (shape validation on steps) -----

    test('pipeMerge: throws if input is not array or object', () => {
        assert.throws(() => {
            pipeMerge('invalid'); // invalid steps
        }, /Expected an array or object of functions/);
    });

    test('pipeMerge: throws if any element is not a function (array)', () => {
        assert.throws(() => {
            pipeMerge([() => ({}), 'not a function'], {}); // invalid step
        }, /must be functions/);
    });

    test('pipeMerge: throws if any value is not a function (object)', () => {
        assert.throws(() => {
            pipeMerge({ ok: () => ({}), bad: 'not a function' }, {}); // invalid step
        }, /Expected an array or object of functions/);
    });

    // ----- Deferred helpers and parity -----

    test('pipeMerge.defer: returns a function; runs when later called', () => {
        const fn = pipeMerge.defer([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        assert.strictEqual(typeof fn, 'function');
        const result = fn({}); // single-arg value (initial)
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge (deferred): context is passed when stateKey is provided', () => {
        // Provide stateKey explicitly via args to the deferred-configured pipe
        const fn = pipeMerge.defer([
            ({ val }) => ({ a: val }),
            ({ val }) => ({ b: val + 1 })
        ], 'state'); // <-- explicit stateKey

        const result = fn({ state: {}, val: 10 }); // treated as context
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('pipeMerge.configure({ defer: true }) behaves like pipeMerge.defer (with stateKey)', () => {
        const fnA = pipeMerge.defer([
            ({ x }) => ({ a: x }),
            ({ x }) => ({ b: x + 1 })
        ], 'state');

        const fnB = pipeMerge.configure({ defer: true })([
            ({ x }) => ({ a: x }),
            ({ x }) => ({ b: x + 1 })
        ], 'state');

        assert.strictEqual(typeof fnA, 'function');
        assert.strictEqual(typeof fnB, 'function');

        const a = fnA({ state: {}, x: 3 });
        const b = fnB({ state: {}, x: 3 });
        assert.deepStrictEqual(a, b);
        assert.deepStrictEqual(a, { a: 3, b: 4 });
    });

    // ----- Immediate via configure (explicit) -----
    // Keep immediate tests purely initial-based now that stateKey has no default.

    test('pipeMerge.configure({ defer: false }): array merges outputs immediately', () => {
        const immediate = pipeMerge.configure({ defer: false });
        const result = immediate([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ], {}); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    // Note: no "respects context" immediate test here because without a default stateKey,
    // immediate mode would need a 3-arg call (steps, stateKey, value), which your current
    // immediate-arity rule interprets differently. Use deferred to exercise context semantics.
};
