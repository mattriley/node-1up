module.exports = ({ test, assert }) => ({ fun }) => {

    test('condition that breaks early', () => {
        const actual = fun.pipeAssignWhile(
            ({ b }) => !b,
            { a: 1 },
            { b: 2 },
            ({ a, b }) => ({ c: a + b }),
            { a: 4 }
        );

        const expected = { a: 1, b: 2 };
        assert.deepEqual(actual, expected);
    });

};
