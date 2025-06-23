module.exports = ({ test, assert }) => lib => {

    const merge = lib.fun.pipeMerge;

    test('pipeMerge: array of functions merges outputs', () => {
        const fn = merge([
            () => ({ a: 1 }),
            () => ({ b: 2 }),
            () => ({ c: 3 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeMerge: object of functions merges outputs', () => {
        const fn = merge({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge: context is passed to each function', () => {
        const fn = merge([
            (acc, ctx) => ({ a: ctx.val }),
            (acc, ctx) => ({ b: ctx.val + 1 })
        ]);
        const result = fn({}, { val: 10 });
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('pipeMerge: initial value is used and preserved', () => {
        const fn = merge([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge: empty array returns initial unchanged', () => {
        const fn = merge([]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeMerge: empty object returns initial unchanged', () => {
        const fn = merge({});
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeMerge: functions can overwrite earlier keys', () => {
        const fn = merge([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('pipeMerge: throws if input is not array or object', () => {
        assert.throws(() => {
            merge('invalid');
        }, /expects an array or object/);
    });

    test('pipeMerge: throws if any element is not a function (array)', () => {
        assert.throws(() => {
            merge([() => ({}), 'not a function']);
        }, /must be functions/);
    });

    test('pipeMerge: throws if any value is not a function (object)', () => {
        assert.throws(() => {
            merge({ ok: () => ({}), bad: 'not a function' });
        }, /must be functions/);
    });

};
