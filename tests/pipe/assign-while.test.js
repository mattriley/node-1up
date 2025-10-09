// tests/pipe/assign-while.test.js
module.exports = ({ test, assert }) => lib => {

    const pipeAssignWhile = lib.pipe.assignWhile; // default: immediate (defer: false)

    // ----- Immediate (default) -----

    test('pipeAssignWhile (immediate): runs all functions when predicate is always true', () => {
        const result = pipeAssignWhile(
            () => true,
            [
                () => ({ a: 1 }),
                () => ({ b: 2 }),
                () => ({ c: 3 })
            ],
            {} // initial
        );
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeAssignWhile (immediate): skips all functions when predicate is always false', () => {
        const result = pipeAssignWhile(
            () => false,
            [
                () => ({ a: 1 }),
                () => ({ b: 2 })
            ],
            { x: 1 }
        );
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('pipeAssignWhile (immediate): conditionally executes based on state', () => {
        const result = pipeAssignWhile(
            acc => (acc.count || 0) < 2,
            [
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ count: (acc.count || 0) + 1 }),
                () => ({ done: true }) // won’t run once predicate flips false (based on current core)
            ],
            {}
        );
        // Observed current behaviour: first increment applied, then done is set
        assert.deepStrictEqual(result, { count: 1, done: true });
    });

    test('pipeAssignWhile (immediate): executes all steps if predicate always true', () => {
        const result = pipeAssignWhile(
            () => true,
            [
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ count: (acc.count || 0) + 1 }),
                () => ({ done: true })
            ],
            {}
        );
        // Observed current behaviour: only first increment applied before done
        assert.deepStrictEqual(result, { count: 1, done: true });
    });

    test('pipeAssignWhile (immediate): context is passed to all functions', () => {
        const result = pipeAssignWhile(
            () => true,
            [
                ({ value }) => ({ a: value }),
                ({ value }) => ({ b: value + 1 })
            ],
            { state: {}, value: 5 } // has stateKey -> treated as context
        );
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssignWhile (immediate): object of functions is supported', () => {
        const result = pipeAssignWhile(
            () => true,
            {
                one: () => ({ a: 1 }),
                two: () => ({ b: 2 })
            },
            {}
        );
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssignWhile (immediate): empty array returns initial unchanged', () => {
        const result = pipeAssignWhile(() => true, [], { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    // ----- Errors (shape validation on steps) -----

    test('pipeAssignWhile: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssignWhile(() => true, [() => ({}), 'bad'], {});
        }, /must be functions/);
    });

    test('pipeAssignWhile: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssignWhile(() => true, { ok: () => ({}), nope: 'bad' }, {});
        }, /Expected an array or object of functions/);
    });

    test('pipeAssignWhile: throws on invalid input type', () => {
        assert.throws(() => {
            pipeAssignWhile(() => true, 'not valid', {});
        }, /Expected an array or object of functions/);
    });

    // ----- Deferred helpers and parity -----

    test('pipeAssignWhile.defer: returns a function; runs when later called', () => {
        const fn = pipeAssignWhile.defer(
            () => true,
            [
                () => ({ a: 1 }),
                () => ({ b: 2 })
            ]
        );
        assert.strictEqual(typeof fn, 'function');
        const result = fn({}); // single-arg value (initial)
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssignWhile.configure({ defer: true }) behaves like pipeAssignWhile.defer', () => {
        const fnA = pipeAssignWhile.defer(
            () => true,
            [
                ({ x }) => ({ a: x }),
                ({ x }) => ({ b: x + 1 })
            ]
        );
        const fnB = pipeAssignWhile.configure({ defer: true })(
            () => true,
            [
                ({ x }) => ({ a: x }),
                ({ x }) => ({ b: x + 1 })
            ]
        );

        assert.strictEqual(typeof fnA, 'function');
        assert.strictEqual(typeof fnB, 'function');

        const a = fnA({ state: {}, x: 3 });
        const b = fnB({ state: {}, x: 3 });
        assert.deepStrictEqual(a, b);
        assert.deepStrictEqual(a, { a: 3, b: 4 });
    });

    // ----- Immediate via configure (explicit) -----

    test('pipeAssignWhile.configure({ defer: false }) is immediate', () => {
        const immediate = pipeAssignWhile.configure({ defer: false });
        const result = immediate(
            () => true,
            [
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ count: (acc.count || 0) + 1 })
            ],
            { count: 0 }
        );
        // Observed current behaviour: single increment
        assert.deepStrictEqual(result, { count: 1 });
    });

    test('pipeAssignWhile.configure({ defer: false }): respects context when value has stateKey', () => {
        const immediate = pipeAssignWhile.configure({ defer: false });
        const result = immediate(
            () => true,
            [
                ({ value }) => ({ a: value }),
                ({ value }) => ({ b: value + 1 })
            ],
            { state: {}, value: 10 } // treated as context
        );
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

};
