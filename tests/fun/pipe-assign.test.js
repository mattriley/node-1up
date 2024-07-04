module.exports = ({ test, assert }) => ({ fun }) => {

    test('combination of values and functions', () => {
        const actual = fun.pipeAssign(
            { a: 1 },
            { b: 2 },
            ({ a, b }) => ({ c: a + b }),
            { a: 4 }
        );

        const expected = { a: 4, b: 2, c: 3 };
        assert.deepEqual(actual, expected);
    });

    test('with args', () => {
        const actual = fun.pipeAssign.args(10, 20)(
            { a: 1 },
            { b: 2 },
            (c, d) => ({ a, b }) => {
                return ({ c: a + b + c + d });
            },
            { a: 4 }
        );

        const expected = { a: 4, b: 2, c: 33 };
        assert.deepEqual(actual, expected);
    });

    test('arrays are flattened', () => {
        const actual = fun.pipeAssign(
            [{ a: 1 }, { b: 2 }],
            [({ a, b }) => ({ c: a + b }), { a: 4 }]
        );

        const expected = { a: 4, b: 2, c: 3 };
        assert.deepEqual(actual, expected);
    });

};
