module.exports = ({ test, assert }) => ({ fun }) => {

    const pipeAssign = fun.pipeAssign;

    test('pipeAssign: array of functions mutates and returns initial object', () => {
        const fn = pipeAssign([
            ({ state }) => ({ a: 1 }),
            ({ state }) => ({ b: 2 }),
            ({ state }) => ({ c: 3 }),
        ]);

        const state = {};
        const result = fn(state);

        assert.strictEqual(result, state);
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeAssign: object of functions mutates and returns initial object', () => {
        const fn = pipeAssign({
            one: ({ state }) => ({ x: 10 }),
            two: ({ state }) => ({ y: 20 }),
        });

        const state = {};
        const result = fn(state);

        assert.strictEqual(result, state);
        assert.deepStrictEqual(result, { x: 10, y: 20 });
    });

    test('pipeAssign: later values overwrite earlier ones', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ a: 2 }),
            () => ({ b: 3 }),
        ]);

        const result = fn({});
        assert.deepStrictEqual(result, { a: 2, b: 3 });
    });

    test('pipeAssign: context is passed to all functions', () => {
        const fn = pipeAssign([
            ({ context }) => ({ a: context.value }),
            ({ context }) => ({ b: context.value + 1 }),
        ]);

        const result = fn({}, { value: 10 });
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('pipeAssign: state is passed as second arg', () => {
        const fn = pipeAssign([
            (_, state) => ({ a: state.existing + 1 }),
            (_, state) => ({ b: state.a + 1 }),
        ]);

        const result = fn({ existing: 1 });
        assert.deepStrictEqual(result, { existing: 1, a: 2, b: 3 });
    });

    test('pipeAssign: ignores undefined and null results', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => undefined,
            () => null,
            () => ({ b: 2 }),
        ]);

        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: throws on invalid top-level input (string)', () => {
        assert.throws(() => {
            pipeAssign('bad');
        }, /pipeAssign expects an array or object of functions/);
    });

    test('pipeAssign: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssign([() => ({}), 'bad']);
        }, /must be functions/);
    });

    test('pipeAssign: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssign({ ok: () => ({}), nope: 123 });
        }, /must be functions/);
    });

    test('pipeAssign: empty array returns initial unchanged', () => {
        const fn = pipeAssign([]);
        const obj = { a: 1 };
        const result = fn(obj);
        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeAssign: empty object returns initial unchanged', () => {
        const fn = pipeAssign({});
        const obj = { a: 1 };
        const result = fn(obj);
        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeAssign: custom stateName is respected in param', () => {
        const fn = pipeAssign([
            ({ custom }) => ({ x: 5 }),
            ({ custom }) => ({ y: custom.x + 2 }),
        ], 'custom');

        const result = fn({});
        assert.deepStrictEqual(result, { x: 5, y: 7 });
    });

};
