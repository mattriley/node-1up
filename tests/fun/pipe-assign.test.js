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

};
