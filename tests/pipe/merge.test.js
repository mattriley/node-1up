module.exports = ({ test, assert }) => lib => {

    const pipeMerge = lib.pipe.merge;

    test('pipeMerge: array of functions merges outputs', () => {
        const fn = pipeMerge([
            () => ({ a: 1 }),
            () => ({ b: 2 }),
            () => ({ c: 3 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeMerge: object of functions merges outputs', () => {
        const fn = pipeMerge({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge: context is passed to each function', () => {
        const fn = pipeMerge([
            ({ val }) => ({ a: val }),
            ({ val }) => ({ b: val + 1 })
        ]);
        const result = fn({}, { val: 10 });
        assert.deepStrictEqual(result, { a: 10, b: 11 });
    });

    test('pipeMerge: initial value is used and preserved', () => {
        const fn = pipeMerge([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeMerge: empty array returns initial unchanged', () => {
        const fn = pipeMerge([]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeMerge: functions can overwrite earlier keys', () => {
        const fn = pipeMerge([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('pipeMerge: throws if input is not array or object', () => {
        assert.throws(() => {
            pipeMerge('invalid');
        }, /Expected an array or object of functions/);
    });

    test('pipeMerge: throws if any element is not a function (array)', () => {
        assert.throws(() => {
            pipeMerge([() => ({}), 'not a function']);
        }, /must be functions/);
    });

    test('pipeMerge: throws if any value is not a function (object)', () => {
        assert.throws(() => {
            pipeMerge({ ok: () => ({}), bad: 'not a function' });
        }, /Expected an array or object of functions/);
    });

};
