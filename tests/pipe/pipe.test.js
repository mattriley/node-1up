module.exports = ({ test, assert }) => lib => {

    const pipe = lib.pipe;

    test('pipe: state is a number', () => {
        const fn = pipe([
            state => state + 1,
            state => state + 1
        ]);
        const initial = 0;
        const result = fn(initial);
        assert.deepStrictEqual(result, 2);
    });

    test('pipe: state is an object', () => {
        const fn = pipe([
            state => ({ num: state.num + 1 }),
            state => ({ num: state.num + 1 })
        ]);
        const initial = { num: 0 };
        const result = fn(initial);
        assert.deepStrictEqual(result, { num: 2 });
    });

    test('pipe: state is an array', () => {
        const fn = pipe([
            () => [1],
            state => [...state, 2]
        ]);
        const initial = undefined;
        const result = fn(initial);
        assert.deepStrictEqual(result, [1, 2]);
    });

};
