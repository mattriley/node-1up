module.exports = ({ test, assert }) => lib => {

    // Defer-on variant
    const pipeAssign = lib.pipe.assign.configure({ defer: true });

    test('pipeAssign: objects and functions accepted', () => {
        const fn = pipeAssign([
            { a: 1 },
            () => ({ b: 2 })
        ]);
        const result = fn({}); // single arg without `stateKey` => treated as initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: array of functions merges outputs shallowly', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        const result = fn({}); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: object of functions merges outputs shallowly', () => {
        const fn = pipeAssign({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({}); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: later functions overwrite keys', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({}); // initial
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('pipeAssign: context is passed to all functions (single arg treated as context when stateKey present)', () => {
        const fn = pipeAssign([
            ({ val }) => ({ a: val }),
            ({ val }) => ({ b: val + 1 })
        ]);
        // Provide a single argument that includes the stateKey so it's treated as context.
        // Assume default stateKey = 'state'. If your stateKey differs, update here.
        const result = fn({ state: {}, val: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssign: initial object is used as base', () => {
        const fn = pipeAssign([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 }); // initial
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: empty array returns initial unchanged', () => {
        const fn = pipeAssign([]);
        const result = fn({ a: 1 }); // initial
        assert.deepStrictEqual(result, { a: 1 });
    });

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
            pipeAssign('not valid');
        }, /Expected an array or object of functions/);
    });

    // Bonus sanity checks for new calling convention:

    test('pipeAssign: single arg treated as context when it contains stateKey; state is read from context[stateKey]', () => {
        const fn = pipeAssign([
            // read both context.val and current state via context.state
            (ctx) => {
                assert.ok('state' in ctx);
                const base = (ctx.state && typeof ctx.state === 'object') ? ctx.state.base : 0;
                return { out: (ctx.val || 0) + base };
            }
        ]);

        const result = fn({ state: { base: 3 }, val: 4 });
        // base persists (not overwritten), out is added on top
        assert.deepStrictEqual(result, { base: 3, out: 7 });
    });

    test('pipeAssign: single arg without stateKey is treated as initial', () => {
        const fn = pipeAssign([
            () => ({ plus: 1 })
        ]);

        const result = fn({ base: 2 }); // treated as initial, not context
        assert.deepStrictEqual(result, { base: 2, plus: 1 });
    });

    // Also verify non-deferred entry defaults to defer=false but still returns a callable
    test('pipeAssign (non-deferred): still returns a function and uses single-arg convention', () => {
        const direct = lib.pipe.assign; // calling directly should default defer to false
        const fn = direct([
            ({ k }) => ({ a: k || 1 })
        ]);

        // No stateKey in the arg => treated as initial, but since step reads from context,
        // we pass a context-like single arg that includes stateKey so it’s treated as context.
        const r1 = fn({ state: {}, k: 2 });
        assert.deepStrictEqual(r1, { a: 2 });

        const r2 = fn({}); // initial, no context.k, default to 1
        assert.deepStrictEqual(r2, { a: 1 });
    });

};
