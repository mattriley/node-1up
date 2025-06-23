module.exports = ({ test, assert }) => ({ fun }) => {

    const assign = fun.pipeAssign;

    test('assign: array of functions merges outputs shallowly', () => {
        const fn = assign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('assign: object of functions merges outputs shallowly', () => {
        const fn = assign({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('assign: later functions overwrite keys', () => {
        const fn = assign([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('assign: context is passed to all functions', () => {
        const fn = assign([
            (acc, ctx) => ({ a: ctx.val }),
            (acc, ctx) => ({ b: ctx.val + 1 })
        ]);
        const result = fn({}, { val: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('assign: initial object is used as base', () => {
        const fn = assign([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('assign: empty array returns initial unchanged', () => {
        const fn = assign([]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('assign: empty object returns initial unchanged', () => {
        const fn = assign({});
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('assign: throws on non-function in array', () => {
        assert.throws(() => {
            assign([() => ({}), 'not a function']);
        }, /must be functions/);
    });

    test('assign: throws on non-function in object', () => {
        assert.throws(() => {
            assign({ ok: () => ({}), bad: 'nope' });
        }, /must be functions/);
    });

    test('assign: throws on invalid input type', () => {
        assert.throws(() => {
            assign('not valid');
        }, /expects an array or object/);
    });

};
