module.exports = ({ test, assert }) => ({ fun }) => {

    const asyncChain = fun.pipeAsync;

    test('asyncChain: runs async functions in sequence', async () => {
        const fn = asyncChain([
            async x => ({ ...x, a: 1 }),
            async x => ({ ...x, b: 2 })
        ]);
        const result = await fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('asyncChain: supports object of async functions', async () => {
        const fn = asyncChain({
            one: async x => ({ ...x, a: 1 }),
            two: async x => ({ ...x, b: 2 })
        });
        const result = await fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('asyncChain: preserves initial if all return undefined', async () => {
        const fn = asyncChain([
            async () => undefined,
            async () => undefined
        ]);
        const result = await fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('asyncChain: skips undefined results and uses last defined', async () => {
        const fn = asyncChain([
            async () => ({ a: 1 }),
            async () => undefined,
            async () => ({ b: 2 })
        ]);
        const result = await fn({});
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('asyncChain: context is passed', async () => {
        const fn = asyncChain([
            async (acc, ctx) => ({ ...acc, a: ctx.val }),
            async (acc, ctx) => ({ ...acc, b: ctx.val + 1 })
        ]);
        const result = await fn({}, { val: 10 });
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('asyncChain: throws on non-function in array', () => {
        assert.throws(() => {
            asyncChain([async () => ({}), 'bad']);
        }, /must be functions/);
    });

    test('asyncChain: throws on non-function in object', () => {
        assert.throws(() => {
            asyncChain({ good: async () => ({}), bad: 'nope' });
        }, /must be functions/);
    });

    test('asyncChain: throws on invalid input type', () => {
        assert.throws(() => {
            asyncChain('not valid');
        }, /expects an array or object/);
    });

};
