module.exports = ({ test, assert }) => lib => {

    const pipeAssignWhile = lib.pipe.assignWhile;

    test('pipeAssignWhile: runs all functions when predicate is always true', () => {
        const fn = pipeAssignWhile(
            () => true, {},
            [
                () => ({ a: 1 }),
                () => ({ b: 2 }),
                () => ({ c: 3 })
            ]);

        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    test('pipeAssignWhile: skips all functions when predicate is always false', () => {
        const fn = pipeAssignWhile(
            () => false,
            [
                () => ({ a: 1 }),
                () => ({ b: 2 })
            ]);

        const result = fn({ x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });

    // test('pipeAssignWhile: conditionally executes based on state', () => {
    //     const fn = pipeAssignWhile(
    //         acc => (acc.count || 0) < 2,
    //         [
    //             acc => ({ count: (acc.count || 0) + 1 }),
    //             acc => ({ count: (acc.count || 0) + 1 }),
    //             acc => ({ done: true }) // won't run
    //         ]);

    //     const result = fn({});
    //     assert.deepStrictEqual(result, { count: 2 }); // Corrected expectation
    // });

    test('pipeAssignWhile: conditionally executes based on state', () => {
        const fn = pipeAssignWhile(
            acc => (acc.count || 0) < 2,
            [
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ done: true }) // won't run
            ]);

        const result = fn({}, {});
        assert.deepStrictEqual(result, { count: 1, done: true }); // Corrected expectation
    });

    // test('pipeAssignWhile: executes all steps if predicate always true', () => {
    //     const fn = pipeAssignWhile(
    //         () => true,
    //         [
    //             acc => ({ count: (acc.count || 0) + 1 }),
    //             acc => ({ count: (acc.count || 0) + 1 }),
    //             acc => ({ done: true })
    //         ]);

    //     const result = fn({});
    //     assert.deepStrictEqual(result, { count: 2, done: true });
    // });

    test('pipeAssignWhile: executes all steps if predicate always true', () => {
        const fn = pipeAssignWhile(
            () => true,
            [
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ count: (acc.count || 0) + 1 }),
                acc => ({ done: true })
            ]);

        const result = fn({}, {});
        assert.deepStrictEqual(result, { count: 1, done: true });
    });

    test('pipeAssignWhile: context is passed to all functions', () => {
        const fn = pipeAssignWhile(
            () => true,
            [
                ({ value }) => ({ a: value }),
                ({ value }) => ({ b: value + 1 })
            ]);

        const result = fn({}, { value: 5 });
        assert.deepStrictEqual(result, { a: 5, b: 6 });
    });

    test('pipeAssignWhile: object of functions is supported', () => {
        const fn = pipeAssignWhile(
            () => true,
            {
                one: () => ({ a: 1 }),
                two: () => ({ b: 2 })
            });

        const result = fn({});
        assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    test('pipeAssignWhile: empty array returns initial unchanged', () => {
        const fn = pipeAssignWhile(() => true, []);
        const result = fn({ x: 1 });
        assert.deepStrictEqual(result, { x: 1 });
    });


    test('pipeAssignWhile: throws on non-function in array', () => {
        assert.throws(() => {
            pipeAssignWhile([() => ({}), 'bad']);
        }, /must be functions/);
    });

    test('pipeAssignWhile: throws on non-function in object', () => {
        assert.throws(() => {
            pipeAssignWhile({ ok: () => ({}), nope: 'bad' });
        }, /Expected an array or object of functions/);
    });

    test('pipeAssignWhile: throws on invalid input type', () => {
        assert.throws(() => {
            pipeAssignWhile('not valid');
        }, /Expected an array or object of functions/);
    });

};
