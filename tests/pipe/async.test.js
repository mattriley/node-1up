// tests/pipe/async.test.js
module.exports = ({ test, assert }) => lib => {

    const pipeAsync = lib.pipe.async; // default: immediate (defer: false)

    // ----- Immediate (default) -----

    test('pipeAsync (immediate): runs async functions in sequence', async () => {
        const result = await pipeAsync([
            async ({ x }) => ({ ...x, a: 1 }),
            async ({ x }) => ({ ...x, b: 2 })
        ], { state: {}, x: {} }); // value with stateKey => treated as context
        // last defined result wins
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync (immediate): supports object of async functions', async () => {
        const result = await pipeAsync({
            one: async ({ x }) => ({ ...x, a: 1 }),
            two: async ({ x }) => ({ ...x, b: 2 })
        }, { state: {}, x: {} });
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync (immediate): skips undefined results and uses last defined', async () => {
        const result = await pipeAsync([
            async () => ({ a: 1 }),
            async () => undefined,
            async () => ({ b: 2 })
        ], {}); // single arg without stateKey => treated as initial
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync (immediate): context is passed', async () => {
        const result = await pipeAsync([
            async ({ val }) => ({ a: val }),
            async ({ val }) => ({ b: val + 1 })
        ], { state: {}, val: 10 }); // treated as context
        assert.deepStrictEqual(result, { b: 11 });
    });

    // ----- Errors (shape validation on steps) -----

    test('pipeAsync: throws on non-function in array', () => {
        assert.throws(() => {
            // validate steps shape; value is irrelevant here
            pipeAsync([async () => ({}), 'bad'], {});
        }, /must be functions/);
    });

    test('pipeAsync: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAsync({ good: async () => ({}), bad: 'nope' }, {});
        }, /Expected an array or object of functions/);
    });

    test('pipeAsync: throws on invalid input type', () => {
        assert.throws(() => {
            pipeAsync('not valid', {});
        }, /Expected an array or object of functions/);
    });

    // ----- Deferred helpers and parity -----

    test('pipeAsync.defer: returns a function; runs when later called', async () => {
        const fn = pipeAsync.defer([
            async ({ x }) => ({ ...x, a: 1 }),
            async ({ x }) => ({ ...x, b: 2 })
        ]);
        assert.strictEqual(typeof fn, 'function');
        const result = await fn({ state: {}, x: {} });
        assert.deepStrictEqual(result, { b: 2 });
    });

    test('pipeAsync.configure({ defer: true }) behaves like pipeAsync.defer', async () => {
        const fnA = pipeAsync.defer([
            async ({ x }) => ({ ...x, a: 1 }),
            async ({ x }) => ({ ...x, b: 2 })
        ]);
        const fnB = pipeAsync.configure({ defer: true })([
            async ({ x }) => ({ ...x, a: 1 }),
            async ({ x }) => ({ ...x, b: 2 })
        ]);

        assert.strictEqual(typeof fnA, 'function');
        assert.strictEqual(typeof fnB, 'function');

        const a = await fnA({ state: {}, x: {} });
        const b = await fnB({ state: {}, x: {} });
        assert.deepStrictEqual(a, b);
        assert.deepStrictEqual(a, { b: 2 });
    });

    // ----- Immediate via configure (explicit) -----

    test('pipeAsync.configure({ defer: false }) is immediate', async () => {
        const immediate = pipeAsync.configure({ defer: false });
        const result = await immediate([
            async n => n + 1,
            async n => n * 3
        ], 1); // value alongside steps (primitive)
        assert.deepStrictEqual(result, 6);
    });

    test('pipeAsync.configure({ defer: false }): respects context when value has stateKey', async () => {
        const immediate = pipeAsync.configure({ defer: false });
        const result = await immediate([
            async ({ val }) => ({ a: val }),
            async ({ val }) => ({ b: val + 1 })
        ], { state: {}, val: 7 });
        assert.deepStrictEqual(result, { b: 8 });
    });

};
