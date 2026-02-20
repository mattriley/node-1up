module.exports = ({ test, assert }) => ({ obj }) => {

    test('returns {} if obj is null', () => {
        const actual = obj.pick(null, ['a']);
        assert.deepEqual(actual, {});
    });

    test('returns {} if paths is not an array', () => {
        const actual = obj.pick({ a: 1 }, 'a');
        assert.deepEqual(actual, {});
    });

    test('flat pick picks only own enumerable properties', () => {
        const input = Object.create({ inherited: 1 });
        input.a = 1;
        input.b = 2;

        const actual = obj.pick(input, ['b', 'inherited', 'missing']);
        assert.deepEqual(actual, { b: 2 });
    });

    test('flat pick does not mutate input object', () => {
        const input = { a: 1, b: 2 };
        const actual = obj.pick(input, ['b']);
        assert.deepEqual(actual, { b: 2 });
        assert.deepEqual(input, { a: 1, b: 2 });
    });

    test('deep pick extracts a nested leaf', () => {
        const input = { a: { b: { c: 1, d: 2 } }, x: 1 };
        const actual = obj.pick(input, ['a.b.c']);
        assert.deepEqual(actual, { a: { b: { c: 1 } } });
    });

    test('deep pick creates empty containers when leaf is missing', () => {
        const input = { a: { b: { c: 1 } }, x: 1 };
        const actual = obj.pick(input, ['a.b.missing']);
        assert.deepEqual(actual, { a: { b: {} } });
    });

    test('deep pick creates empty containers when intermediate segment is not an object', () => {
        const input = { a: { b: 1 } };
        const actual = obj.pick(input, ['a.b.c']);
        assert.deepEqual(actual, { a: { b: {} } });
    });

    test('deep pick supports multiple paths that share prefix', () => {
        const input = { a: { b: { c: 1, d: 2 }, z: 9 }, x: 1 };
        const actual = obj.pick(input, ['a.b.c', 'a.b.d']);
        assert.deepEqual(actual, { a: { b: { c: 1, d: 2 } } });
    });

    test('deep pick supports multiple paths with different roots', () => {
        const input = { a: { b: { c: 1 } }, x: { y: 2 }, z: 3 };
        const actual = obj.pick(input, ['a.b.c', 'x.y', 'z']);
        assert.deepEqual(actual, { a: { b: { c: 1 } }, x: { y: 2 }, z: 3 });
    });

    test('depth option prevents picking deeper paths', () => {
        const input = { a: { b: { c: 1 } }, x: 1 };
        const actual = obj.pick(input, ['a.b.c'], { depth: 2 });
        assert.deepEqual(actual, {});
    });

    test('depth option allows picking at exact depth', () => {
        const input = { a: { b: { c: 1 }, d: 2 }, x: 1 };
        const actual = obj.pick(input, ['a.d'], { depth: 2 });
        assert.deepEqual(actual, { a: { d: 2 } });
    });

    test('custom delimiters are respected', () => {
        const input = { a: { b: { c: 1, d: 2 } }, x: 1 };
        const actual = obj.pick(input, ['a|b|d'], { delimiters: ['|'] });
        assert.deepEqual(actual, { a: { b: { d: 2 } } });
    });

    test('flat detection: mixed delimiter presence forces deep mode', () => {
        const input = { a: 1, b: { c: 2 } };
        const actual = obj.pick(input, ['a', 'b.c']);
        assert.deepEqual(actual, { a: 1, b: { c: 2 } });
    });

    test('deep pick can index arrays via numeric keys', () => {
        const input = { a: [{ b: 1 }, { b: 2 }] };
        const actual = obj.pick(input, ['a.0.b']);
        assert.deepEqual(actual, { a: { '0': { b: 1 } } });
    });

    test('deep pick ignores empty path', () => {
        const input = { a: 1 };
        const actual = obj.pick(input, ['']);
        assert.deepEqual(actual, {});
    });

};
