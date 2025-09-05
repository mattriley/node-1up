module.exports = ({ test, assert }) => lib => {

    test('flatten', () => {
        const input = {
            a: 1,
            sub: {
                b: 2
            }
        };
        const actual = lib.obj.configure.flat({ mutate: false })(input);
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
        const actual = lib.obj.configure.flat({ mutate: false, delimiter: '.' })(input);
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
        assert.throws(() => lib.obj.configure.flat({ mutate: false })(input), /Collision: a/);
    });

};
