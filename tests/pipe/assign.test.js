module.exports = ({ test, assert }) => lib => {

    const pipeAssign = lib.pipe.assign;

    test('pipeAssign: array of functions merges outputs shallowly', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ b: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: object of functions merges outputs shallowly', () => {
        const fn = pipeAssign({
            one: () => ({ a: 1 }),
            two: () => ({ b: 2 })
        });
        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: later functions overwrite keys', () => {
        const fn = pipeAssign([
            () => ({ a: 1 }),
            () => ({ a: 2 })
        ]);
        const result = fn({});
        assert.deepStrictEqual(result, { a: 2 });
    });

    test('pipeAssign: context is passed to all functions', () => {
        const fn = pipeAssign([
            ({ val }) => ({ a: val }),
            ({ val }) => ({ b: val + 1 })
        ]);
        const result = fn({}, { val: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssign: initial object is used as base', () => {
        const fn = pipeAssign([
            () => ({ b: 2 })
        ]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssign: empty array returns initial unchanged', () => {
        const fn = pipeAssign([]);
        const result = fn({ a: 1 });
        assert.deepStrictEqual(result, { a: 1 });
    });

    test('pipeAssign: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssign([() => ({}), 'not a function']);
        }, /All elements must be functions/);
    });

    test('pipeAssign: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssign({ ok: () => ({}), bad: 'nope' });
        }, /Expected an array or object of functions/);
    });

    test('pipeAssign: throws on invalid input type', () => {
        assert.throws(() => {
            pipeAssign('not valid');
        }, /Expected an array or object of functions/);
    });

};
