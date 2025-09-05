const assert = require('assert');

module.exports = ({ test }) => lib => {
    const compact = lib.obj.compact;

    test('compact: deeply removes empty values', () => {
        const input = {
            a: '',
            b: null,
            c: undefined,
            d: [],
            e: {},
            f: { x: '', y: {}, z: 'ok' },
            g: [null, '', {}, 'value']
        };

        const expected = {
            f: { z: 'ok' },
            g: ['value']
        };

        compact(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compact: removes non-JSON-compatible types', () => {
        const input = {
            a: () => { },
            b: Symbol('sym'),
            c: BigInt(10),
            d: 'ok',
            e: [BigInt(1), 'valid', {}, undefined]
        };

        const expected = {
            d: 'ok',
            e: ['valid']
        };

        compact(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compact: handles mixed nested structures', () => {
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

        compact(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compact: keeps valid primitives', () => {
        const input = {
            a: 0,
            b: false,
            c: true,
            d: 'non-empty'
        };

        const expected = { ...input };

        compact(input);
        assert.deepStrictEqual(input, expected);
    });

    test('compact: no-op on already clean object', () => {
        const input = {
            a: 'ok',
            b: [1, 2, 3],
            c: { x: 'yes' }
        };

        const copy = JSON.parse(JSON.stringify(input));
        compact(input);
        assert.deepStrictEqual(input, copy);
    });

    test('compact: primitive input returns value or undefined', () => {
        assert.strictEqual(compact('valid'), 'valid');
        assert.strictEqual(compact(''), undefined);
        assert.strictEqual(compact(null), undefined);
        assert.strictEqual(compact(undefined), undefined);
        assert.strictEqual(compact(42), 42);
        assert.strictEqual(compact(false), false);
        assert.strictEqual(compact(true), true);
        assert.strictEqual(compact(() => { }), undefined);
        assert.strictEqual(compact(Symbol('x')), undefined);
        assert.strictEqual(compact(BigInt(10)), undefined);
    });
};
