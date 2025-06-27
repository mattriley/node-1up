module.exports = ({ test, assert }) => lib => {

    const compactInPlace = lib.obj.compactInPlace;

    test('compactInPlace: deeply removes empty values', () => {
        const input = {
            a: '',
            b: null,
            c: undefined,
            d: [],
            e: {},
            f: { x: '', y: {}, z: 'ok' },
            g: [null, '', {}, 'value'],
        };

        const expected = {
            f: { z: 'ok' },
            g: ['value']
        };

        compactInPlace(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compactInPlace: removes non-JSON-compatible types', () => {
        const input = {
            a: () => { },
            b: Symbol('sym'),
            c: BigInt(10),
            d: 'ok',
            e: [BigInt(1), 'valid', {}, undefined],
        };

        const expected = {
            d: 'ok',
            e: ['valid']
        };

        compactInPlace(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compactInPlace: handles mixed nested structures', () => {
        const input = {
            a: {
                b: {
                    c: '',
                    d: { e: {} },
                    f: 'keep'
                }
            },
            g: [null, '', { h: null }, { i: 'yes' }]
        };

        const expected = {
            a: {
                b: {
                    f: 'keep'
                }
            },
            g: [{ i: 'yes' }]
        };

        compactInPlace(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compactInPlace: keeps valid primitives', () => {
        const input = {
            a: 0,
            b: false,
            c: true,
            d: 'non-empty'
        };

        const expected = { ...input };

        compactInPlace(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compactInPlace: no-op on already clean object', () => {
        const input = {
            a: 'ok',
            b: [1, 2, 3],
            c: { x: 'yes' }
        };

        const copy = JSON.parse(JSON.stringify(input));
        compactInPlace(input);
        assert.deepStrictEqual(input, copy);
    });
};
