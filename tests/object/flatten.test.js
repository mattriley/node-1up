module.exports = ({ test, assert }) => ({ o }) => {

    test('flatten', () => {
        const input = {
            a: 1,
            sub: {
                b: 2
            }
        };
        assert.deepEqual(o.flatten(input), { a: 1, b: 2 });
    });

};
