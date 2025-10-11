// tests/pipe/assign.test.js
module.exports = ({ test, assert }) => lib => {

    // Use deferred variant for most tests so we can pass an explicit stateKey when needed
    const pipeAssign = lib.pipe.assign.configure({ defer: true });

    test('pipeAssign (deferred): objects and functions accepted', () => {
        const fn = pipeAssign([
            { a: 1 },
            () => ({ b: 2 })
        ]);
        const result = fn({}); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign (deferred): array of functions merges outputs shallowly', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign (deferred): object of functions merges outputs shallowly', () => {
        const fn = pipeAssign({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign (deferred): later functions overwrite keys', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('pipeAssign (deferred): context is passed to all functions when stateKey is provided', () => {
        // Explicitly pass stateKey so single-arg call is treated as context
        const fn = pipeAssign([
            ({ val }) => ({ a: val }),
            ({ val }) => ({ b: val + 1 })
        ], 'state'); // <- explicit stateKey
        const result = fn({ state: {}, val: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssign (deferred): initial object is used as base', () => {
        const fn = pipeAssign([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign (deferred): empty array returns initial unchanged', () => {
        const fn = pipeAssign([]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    // ----- Errors (shape validation on steps) -----

    test('pipeAssign: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssign([() => ({}), 'not a function']);
        }, /All elements must be functions/);
    });

    test('pipeAssign: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssign({ ok: () => ({}), bad: 'nope' });
        }, /Expected an array or object of functions/);
    });

    test('pipeAssign: throws on invalid input type', () => {
        assert.throws(() => {
            // @ts-expect-error
            pipeAssign('not valid');
        }, /Expected an array or object of functions/);
    });

    // ----- Context semantics (explicit stateKey) -----

    test('pipeAssign (deferred): single arg treated as context when it contains stateKey; state is read from context[stateKey]', () => {
        const fn = pipeAssign([
            // ctx is the context; state is under ctx.state (since we pass 'state' as stateKey)
            (ctx) => {
                assert.ok('state' in ctx);
                const base = (ctx.state && typeof ctx.state === 'object') ? ctx.state.base : 0;
                return { out: (ctx.val || 0) + base };
            }
        ], 'state');

        const result = fn({ state: { base: 3 }, val: 4 });
        // base persists from initial, out is computed
        assert.deepStrictEqual(result, { base: 3, out: 7 });
    });

    // ----- Immediate (no implicit context; purely initial-based) -----

    test('pipeAssign (immediate): returns a RESULT, not a function', () => {
        const direct = lib.pipe.assign; // defer: false by default
        const result = direct([
            // no dependency on context here; just return a constant shape
            () => ({ a: 1 })
        ], {}); // initial object
        assert.deepStrictEqual(result, { a: 1 });
    });

};
