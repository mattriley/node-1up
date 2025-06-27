module.exports = ({ test, assert }) => lib => {

    const pipeAsync = lib.pipe.async;

    test('pipeAsync: runs async functions in sequence', async () => {
        const fn = pipeAsync([
            async ({ x }) => ({ ...x, a: 1 }),
            async ({ x }) => ({ ...x, b: 2 })
        ]);
        const result = await fn({}, {});
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync: supports object of async functions', async () => {
        const fn = pipeAsync({
            one: async ({ x }) => ({ ...x, a: 1 }),
            two: async ({ x }) => ({ ...x, b: 2 })
        });
        const result = await fn({}, {});
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync: skips undefined results and uses last defined', async () => {
        const fn = pipeAsync([
            async () => ({ a: 1 }),
            async () => undefined,
            async () => ({ b: 2 })
        ]);
        const result = await fn({});
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync: context is passed', async () => {
        const fn = pipeAsync([
            async ({ val }) => ({ a: val }),
            async ({ val }) => ({ b: val + 1 })
        ]);
        const result = await fn({}, { val: 10 });
        assert.deepStrictEqual(result, { b: 11 });
    });

    test('pipeAsync: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAsync([async () => ({}), 'bad']);
        }, /must be functions/);
    });

    test('pipeAsync: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAsync({ good: async () => ({}), bad: 'nope' });
        }, /Expected an array or object of functions/);
    });

    test('pipeAsync: throws on invalid input type', () => {
        assert.throws(() => {
            pipeAsync('not valid');
        }, /Expected an array or object of functions/);
    });

};
