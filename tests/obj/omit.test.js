module.exports = ({ test, assert }) => ({ obj }) => {

    test('returns {} if obj is null', () => {
        const actual = obj.omit(null, ['a']);
        assert.deepEqual(actual, {});
    });

    test('returns {} if paths is not an array', () => {
        const actual = obj.omit({ a: 1 }, 'a');
        assert.deepEqual(actual, {});
    });

    test('flat omit removes only own enumerable properties', () => {
        const input = Object.create({ inherited: 1 });
        input.a = 1;
        input.b = 2;
        input.c = 3;

        const actual = obj.omit(input, ['b', 'missing']);
        assert.deepEqual(actual, { a: 1, c: 3 });
    });

    test('flat omit does not mutate input object', () => {
        const input = { a: 1, b: 2 };
        const actual = obj.omit(input, ['b']);
        assert.deepEqual(actual, { a: 1 });
        assert.deepEqual(input, { a: 1, b: 2 });
    });

    test('deep omit removes a nested leaf', () => {
        const input = { a: { b: { c: 1, d: 2 } }, x: 1 };
        const actual = obj.omit(input, ['a.b.c']);
        assert.deepEqual(actual, { a: { b: { d: 2 } }, x: 1 });
    });

    test('deep omit ignores missing deep path', () => {
        const input = { a: { b: { c: 1 } }, x: 1 };
        const actual = obj.omit(input, ['a.b.missing']);
        assert.deepEqual(actual, { a: { b: { c: 1 } }, x: 1 });
    });

    test('deep omit does not mutate input object', () => {
        const input = { a: { b: { c: 1, d: 2 } }, x: 1 };
        const actual = obj.omit(input, ['a.b.c']);
        assert.deepEqual(actual, { a: { b: { d: 2 } }, x: 1 });
        assert.deepEqual(input, { a: { b: { c: 1, d: 2 } }, x: 1 });
    });

    test('deep omit supports multiple paths', () => {
        const input = { a: { b: { c: 1, d: 2 }, z: 9 }, x: 1, y: 2 };
        const actual = obj.omit(input, ['a.b.c', 'y', 'a.z']);
        assert.deepEqual(actual, { a: { b: { d: 2 } }, x: 1 });
    });

    test('depth option prevents omitting deeper paths', () => {
        const input = { a: { b: { c: 1, d: 2 } }, x: 1 };
        const actual = obj.omit(input, ['a.b.c'], { depth: 2 });
        assert.deepEqual(actual, { a: { b: { c: 1, d: 2 } }, x: 1 });
    });

    test('depth option allows omitting at exact depth', () => {
        const input = { a: { b: { c: 1 }, d: 2 }, x: 1 };
        const actual = obj.omit(input, ['a.d'], { depth: 2 });
        assert.deepEqual(actual, { a: { b: { c: 1 } }, x: 1 });
    });

    test('custom delimiters are respected', () => {
        // assumes omit uses $.self.buildDelimitersRegex and split() the same as pick
        const input = { a: { b: { c: 1, d: 2 } }, x: 1 };
        const actual = obj.omit(input, ['a|b|c'], { delimiters: ['|'] });
        assert.deepEqual(actual, { a: { b: { d: 2 } }, x: 1 });
    });

    test('deep omit clones arrays when descending and deletes by key', () => {
        const input = { a: [{ b: 1 }, { b: 2 }] };

        // This test documents current semantics: path segments are keys, so "a.0.b" works.
        const actual = obj.omit(input, ['a.0.b']);
        assert.deepEqual(actual, { a: [{}, { b: 2 }] });

        // Ensure input unchanged
        assert.deepEqual(input, { a: [{ b: 1 }, { b: 2 }] });
    });

    test('deep omit of a whole child object key', () => {
        const input = { a: { b: { c: 1 } }, x: 1 };
        const actual = obj.omit(input, ['a.b']);
        assert.deepEqual(actual, { a: {}, x: 1 });
    });

};
