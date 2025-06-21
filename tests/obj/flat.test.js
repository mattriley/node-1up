module.exports = ({ test, assert }) => lib => {

    test('flatten', () => {
        const input = {
            a: 1,
            sub: {
                b: 2
            }
        };
        const actual = lib.obj.flat(input);
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
        const actual = lib.obj.flat(input, { delimiter: '.' });
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
        assert.throws(() => lib.obj.flat(input), /Collision: a/);
    });

};
