module.exports = ({ test, assert }) => ({ fun }) => {

    test('pipe-assign', () => {
        const input = [
            { a: 1 },
            { b: 2 },
            ({ a, b }) => ({ c: a + b }),
            { a: 4 }
        ];

        const expected = { a: 4, b: 2, c: 3 };
        assert.deepEqual(fun.pipeAssign(...input), expected);
    });

};
