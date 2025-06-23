module.exports = ({ test, assert }) => lib => {

    const pipeAssignWhile = lib.fun.pipeAssignWhile;

    test('pipeAssignWhile: runs all functions when predicate is always true', () => {
        const fn = pipeAssignWhile([
            () => ({ a: 1 }),
            () => ({ b: 2 }),
            () => ({ c: 3 })
        ]);

        const result = fn(() => true, {});
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeAssignWhile: skips all functions when predicate is always false', () => {
        const fn = pipeAssignWhile([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);

        const result = fn(() => false, { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('pipeAssignWhile: conditionally executes based on state', () => {
        const fn = pipeAssignWhile([
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ done: true }) // won't run
        ]);

        const result = fn(acc => (acc.count || 0) < 2, {});
        assert.deepStrictEqual(result, { count: 2 }); // Corrected expectation
    });

    test('pipeAssignWhile: executes all steps if predicate always true', () => {
        const fn = pipeAssignWhile([
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ done: true })
        ]);

        const result = fn(() => true, {});
        assert.deepStrictEqual(result, { count: 2, done: true });
    });

    test('pipeAssignWhile: context is passed to all functions', () => {
        const fn = pipeAssignWhile([
            (acc, ctx) => ({ a: ctx.value }),
            (acc, ctx) => ({ b: ctx.value + 1 })
        ]);

        const result = fn(() => true, {}, { value: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssignWhile: object of functions is supported', () => {
        const fn = pipeAssignWhile({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });

        const result = fn(() => true, {});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssignWhile: empty array returns initial unchanged', () => {
        const fn = pipeAssignWhile([]);
        const result = fn(() => true, { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('pipeAssignWhile: empty object returns initial unchanged', () => {
        const fn = pipeAssignWhile({});
        const result = fn(() => true, { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('pipeAssignWhile: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssignWhile([() => ({}), 'bad']);
        }, /must be functions/);
    });

    test('pipeAssignWhile: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssignWhile({ ok: () => ({}), nope: 'bad' });
        }, /must be functions/);
    });

    test('pipeAssignWhile: throws on invalid input type', () => {
        assert.throws(() => {
            pipeAssignWhile('not valid');
        }, /expects an array or object/);
    });

};
