module.exports = ({ test, assert }) => ({ fun }) => {

    const conditionalAssign = fun.pipeAssignWhile;

    test('conditionalAssign: runs all functions when predicate is always true', () => {
        const fn = conditionalAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 }),
            () => ({ c: 3 })
        ]);

        const result = fn(() => true, {});
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('conditionalAssign: skips all functions when predicate is always false', () => {
        const fn = conditionalAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);

        const result = fn(() => false, { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('conditionalAssign: conditionally executes based on state', () => {
        const fn = conditionalAssign([
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ done: true }) // won't run
        ]);

        const result = fn(acc => (acc.count || 0) < 2, {});
        assert.deepStrictEqual(result, { count: 2 }); // Corrected expectation
    });

    test('conditionalAssign: executes all steps if predicate always true', () => {
        const fn = conditionalAssign([
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ count: (acc.count || 0) + 1 }),
            acc => ({ done: true })
        ]);

        const result = fn(() => true, {});
        assert.deepStrictEqual(result, { count: 2, done: true });
    });

    test('conditionalAssign: context is passed to all functions', () => {
        const fn = conditionalAssign([
            (acc, ctx) => ({ a: ctx.value }),
            (acc, ctx) => ({ b: ctx.value + 1 })
        ]);

        const result = fn(() => true, {}, { value: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('conditionalAssign: object of functions is supported', () => {
        const fn = conditionalAssign({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });

        const result = fn(() => true, {});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('conditionalAssign: empty array returns initial unchanged', () => {
        const fn = conditionalAssign([]);
        const result = fn(() => true, { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('conditionalAssign: empty object returns initial unchanged', () => {
        const fn = conditionalAssign({});
        const result = fn(() => true, { x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    test('conditionalAssign: throws on non-function in array', () => {
        assert.throws(() => {
            conditionalAssign([() => ({}), 'bad']);
        }, /must be functions/);
    });

    test('conditionalAssign: throws on non-function in object', () => {
        assert.throws(() => {
            conditionalAssign({ ok: () => ({}), nope: 'bad' });
        }, /must be functions/);
    });

    test('conditionalAssign: throws on invalid input type', () => {
        assert.throws(() => {
            conditionalAssign('not valid');
        }, /expects an array or object/);
    });

};
