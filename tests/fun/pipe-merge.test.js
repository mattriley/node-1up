module.exports = ({ test, assert }) => ({ fun }) => {

    const merge = fun.pipeMerge;

    test('merge: array of functions merges outputs', () => {
        const fn = merge([
            () => ({ a: 1 }),
            () => ({ b: 2 }),
            () => ({ c: 3 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('merge: object of functions merges outputs', () => {
        const fn = merge({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('merge: context is passed to each function', () => {
        const fn = merge([
            (acc, ctx) => ({ a: ctx.val }),
            (acc, ctx) => ({ b: ctx.val + 1 })
        ]);
        const result = fn({}, { val: 10 });
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('merge: initial value is used and preserved', () => {
        const fn = merge([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('merge: empty array returns initial unchanged', () => {
        const fn = merge([]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('merge: empty object returns initial unchanged', () => {
        const fn = merge({});
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('merge: functions can overwrite earlier keys', () => {
        const fn = merge([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('merge: throws if input is not array or object', () => {
        assert.throws(() => {
            merge('invalid');
        }, /expects an array or object/);
    });

    test('merge: throws if any element is not a function (array)', () => {
        assert.throws(() => {
            merge([() => ({}), 'not a function']);
        }, /must be functions/);
    });

    test('merge: throws if any value is not a function (object)', () => {
        assert.throws(() => {
            merge({ ok: () => ({}), bad: 'not a function' });
        }, /must be functions/);
    });

};
