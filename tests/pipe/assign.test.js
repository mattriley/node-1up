// tests/pipe/assign.test.js
module.exports = ({ test, assert }) => lib => {

    const pipeAssign = lib.pipe.assign.configure({ defer: true });

    test('pipeAssign: objects and functions accepted', () => {
        const fn = pipeAssign([
            { a: 1 },
            () => ({ b: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: array of functions merges outputs shallowly', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: object of functions merges outputs shallowly', () => {
        const fn = pipeAssign({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: later functions overwrite keys', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('pipeAssign: context is passed to all functions (single arg treated as context when stateKey present)', () => {
        const fn = pipeAssign([
            ({ val }) => ({ a: val }),
            ({ val }) => ({ b: val + 1 })
        ]);
        const result = fn({ state: {}, val: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssign: initial object is used as base', () => {
        const fn = pipeAssign([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: empty array returns initial unchanged', () => {
        const fn = pipeAssign([]);
        const result = fn({ a: 1 });
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

    // Context contains stateKey: state is read from context[stateKey]
    test('pipeAssign: single arg treated as context when it contains stateKey; state is read from context[stateKey]', () => {
        const fn = pipeAssign([
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

    // Non-deferred defaults to immediate: call returns a RESULT, not a function
    test('pipeAssign (non-deferred): immediate invocation with single value', () => {
        const direct = lib.pipe.assign; // defer: false by default
        const result1 = direct([
            ({ k }) => ({ a: k || 1 })
        ], { state: {}, k: 2 });
        assert.deepStrictEqual(result1, { a: 2 });

        const result2 = direct([
            ({ k }) => ({ a: k || 1 })
        ], {}); // no stateKey/no k -> initial {}
        assert.deepStrictEqual(result2, { a: 1 });
    });

};
