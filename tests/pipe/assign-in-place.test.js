module.exports = ({ test, assert }) => lib => {

    const pipeAssignInPlace = lib.pipe.assignInPlace;

    test('pipeAssign: applies array of functions to state', () => {
        const fn = pipeAssignInPlace([
            ({ state }) => ({ a: 1 }),
            ({ state }) => ({ b: 2 }),
            ({ state }) => ({ c: 3 })
        ]);

        const obj = {};
        const result = fn(obj);

        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeAssign: applies object of functions to state', () => {
        const fn = pipeAssignInPlace({
            one: ({ state }) => ({ x: 10 }),
            two: ({ state }) => ({ y: 20 })
        });

        const obj = {};
        const result = fn(obj);

        assert.strictEqual(result, obj);
        assert.deepStrictEqual(result, { x: 10, y: 20 });
    });

    test('pipeAssign: respects custom stateKey alias', () => {
        const fn = pipeAssignInPlace([
            ({ acc }) => ({ x: 5 }),
            ({ acc }) => ({ y: 15 })
        ], 'acc');

        const obj = {};
        const result = fn(obj);

        assert.deepStrictEqual(result, { x: 5, y: 15 });
    });

    test('pipeAssign: uses defaultContext if none passed', () => {
        const fn = pipeAssignInPlace([
            ({ foo }) => ({ a: foo })
        ], { foo: 42 });

        const obj = {};
        const result = fn(obj);

        assert.deepStrictEqual(result, { a: 42 });
    });

    test('pipeAssign: context override takes precedence', () => {
        const fn = pipeAssignInPlace([
            ({ bar }) => ({ a: bar })
        ], { bar: 'old' });

        const obj = {};
        const result = fn(obj, { bar: 'new' });

        assert.deepStrictEqual(result, { a: 'new' });
    });

    test('pipeAssign: result must be plain object to be assigned', () => {
        const fn = pipeAssignInPlace([
            () => null,
            () => 'string',
            () => 123,
            () => ['array'],
            () => ({ valid: true })
        ]);

        const obj = {};
        const result = fn(obj);

        assert.deepStrictEqual(result, { valid: true });
    });

    test('pipeAssign: input arguments in any order', () => {
        const steps = [
            ({ acc }) => ({ x: 1 }),
            ({ acc }) => ({ y: 2 })
        ];
        const context = { ctx: true };

        const variants = [
            pipeAssignInPlace(steps, context, 'acc'),
            pipeAssignInPlace(context, 'acc', steps),
            pipeAssignInPlace('acc', steps, context)
        ];

        for (const fn of variants) {
            const obj = {};
            const result = fn(obj);
            assert.deepStrictEqual(result, { x: 1, y: 2 });
        }
    });

    test('pipeAssign: throws on invalid steps', () => {
        assert.throws(() => pipeAssignInPlace(123), /Expected an array or object of functions/);
        assert.throws(() => pipeAssignInPlace([1, 2]), /All elements must be functions/);
        assert.throws(() => pipeAssignInPlace({ one: 1 }), /Expected an array or object of functions/);
    });

};
