module.exports = ({ test, assert }) => ({ fun }) => {

    const pipeAssign = fun.pipeAssign;

    test('pipeAssign: array of functions mutates and returns initial object', () => {
        const fn = pipeAssign([
            acc => ({ a: 1 }),
            acc => ({ b: 2 }),
            acc => ({ c: 3 })
        ]);

        const obj = {};
        const result = fn(obj);

        assert.strictEqual(result, obj); // same reference
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeAssign: object of functions mutates and returns initial object', () => {
        const fn = pipeAssign({
            one: acc => ({ x: 10 }),
            two: acc => ({ y: 20 })
        });

        const obj = {};
        const result = fn(obj);

        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { x: 10, y: 20 });
    });

    test('pipeAssign: later values overwrite earlier ones', () => {
        const fn = pipeAssign([
            acc => ({ a: 1 }),
            acc => ({ a: 2 }),
            acc => ({ b: 3 })
        ]);

        const result = fn({});
        assert.deepStrictEqual(result, { a: 2, b: 3 });
    });

    test('pipeAssign: context is passed to all functions', () => {
        const fn = pipeAssign([
            (acc, ctx) => ({ a: ctx.value }),
            (acc, ctx) => ({ b: ctx.value + 1 })
        ]);

        const result = fn({}, { value: 10 });
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('pipeAssign: ignores undefined result and continues', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => undefined,
            () => ({ b: 2 })
        ]);

        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: skips null result', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => null,
            () => ({ b: 2 })
        ]);

        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: empty array returns initial unchanged', () => {
        const fn = pipeAssign([]);
        const obj = { z: 9 };
        const result = fn(obj);
        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { z: 9 });
    });

    test('pipeAssign: empty object returns initial unchanged', () => {
        const fn = pipeAssign({});
        const obj = { z: 9 };
        const result = fn(obj);
        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { z: 9 });
    });

    test('pipeAssign: throws on invalid top-level input (string)', () => {
        assert.throws(() => {
            pipeAssign('nope');
        }, /pipeAssign expects an array or object of functions/);
    });

    test('pipeAssign: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssign([() => ({}), 'bad']);
        }, /All elements in pipeAssign must be functions/);
    });

    test('pipeAssign: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssign({ ok: () => ({}), bad: 123 });
        }, /All elements in pipeAssign must be functions/);
    });

    test('pipeAssign: result is mutated in place', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        const base = { existing: true };
        const result = fn(base);
        assert.strictEqual(result, base);
        assert.deepStrictEqual(result, { existing: true, a: 1, b: 2 });
    });

};
