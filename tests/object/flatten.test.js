module.exports = ({ test, assert }) => ({ o }) => {

    test('flatten', () => {
        const input = {
            a: 1,
            sub: {
                b: 2
            }
        };
        const actual = o.flatten(input);
        const expected = { a: 1, b: 2 };
        assert.deepEqual(actual, expected);
    });

    test('flatten with delimiter', () => {
        const input = {
            a: 1,
            sub: {
                b: 2
            }
        };
        const actual = o.flatten(input, { delimiter: '.' });
        const expected = { a: 1, 'sub.b': 2 };
        assert.deepEqual(actual, expected);
    });

    test('collision', () => {
        const input = {
            a: 1,
            sub: {
                a: 1
            }
        };
        assert.throws(() => o.flatten(input), /Collision: a/);
    });

};
