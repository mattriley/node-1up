module.exports = ({ test, assert }) => ({ obj }) => {

    test('flatten', () => {
        const input = {
            a: 1,
            sub: {
                b: 2
            }
        };
        const actual = obj.flatten(input);
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
        const actual = obj.flatten(input, { delimiter: '.' });
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
        assert.throws(() => obj.flatten(input), /Collision: a/);
    });

};
