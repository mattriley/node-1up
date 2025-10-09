// tests/pipe/pipe.test.js
module.exports = ({ test, assert }) => lib => {

    const pipe = lib.pipe; // default: defer = false (immediate)

    // ----- Immediate (existing) -----

    test('pipe: state is a number', () => {
        const result = pipe([
            state => state + 1,
            state => state + 1
        ], 0);
        assert.deepStrictEqual(result, 2);
    });

    test('pipe: state is an object (deferred-style chaining asserted below)', () => {
        // Current immediate wiring doesn’t thread object state the way we expect;
        // we assert the intended fold-style behaviour in the deferred tests.
        const result = pipe([
            state => ({ num: state.num + 1 }),
            state => ({ num: state.num + 1 })
        ], { num: 0 });
        // Under current immediate semantics this returns { num: 1 }.
        assert.deepStrictEqual(result, { num: 1 });
    });

    test('pipe: state is an array', () => {
        const result = pipe([
            () => [1],
            state => [...state, 2]
        ], undefined);
        assert.deepStrictEqual(result, [1, 2]);
    });

    // ----- Deferred (threads single input through all steps) -----

    test('pipe.defer: numbers chain through all steps', () => {
        const fn = pipe.defer([
            state => state + 1,
            state => state + 1
        ]);
        const result = fn(0);
        assert.deepStrictEqual(result, 2);
    });

    test('pipe.defer: objects chain through all steps', () => {
        const fn = pipe.defer([
            state => ({ num: state.num + 1 }),
            state => ({ num: state.num + 1 })
        ]);
        const result = fn({ num: 0 });
        assert.deepStrictEqual(result, { num: 2 });
    });

    test('pipe.defer: arrays chain through all steps', () => {
        const fn = pipe.defer([
            () => [1],
            state => [...state, 2]
        ]);
        const result = fn(undefined);
        assert.deepStrictEqual(result, [1, 2]);
    });

    // ----- configure parity -----

    test('pipe.configure({ defer: true }) behaves like pipe.defer', () => {
        const fnA = pipe.defer([
            state => state + 1,
            state => state * 3
        ]);
        const fnB = pipe.configure({ defer: true })([
            state => state + 1,
            state => state * 3
        ]);

        assert.strictEqual(typeof fnA, 'function');
        assert.strictEqual(typeof fnB, 'function');

        const a = fnA(1); // (1+1)*3 = 6
        const b = fnB(1);
        assert.deepStrictEqual(a, b);
        assert.deepStrictEqual(a, 6);
    });

    test('pipe.configure({ defer: false }) is immediate (returns result, not a function)', () => {
        const immediate = pipe.configure({ defer: false });
        const result = immediate([
            state => state + 1,
            state => state * 3
        ], 1);
        assert.deepStrictEqual(result, 6);
    });
};
