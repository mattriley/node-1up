module.exports = ({ test, assert }) => lib => {

    const applyCorrections = lib.obj.applyCorrections;

    // Each corrections entry is an array where the first item is the preferred value.
    const REMAP = {
        color: [
            ['Red', 'red', 'rouge'],
            ['Blue', 'blue'],
            ['Green', 'green']
        ],
        tags: [
            ['Foo', 'foo', 'FOO'],
            ['Baz', 'baz']
        ]
    };

    test('scalar field corrected case-insensitively (mutate=false default)', () => {
        const input = { color: 'ROUGE', other: 'keep' };
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out, { color: 'Red', other: 'keep', tags: undefined });
        // input not mutated
        assert.deepEqual(input, { color: 'ROUGE', other: 'keep' });
        assert.notStrictEqual(out, input);
    });

    test('array field corrected element-wise; non-matches preserved', () => {
        const input = { tags: ['foo', 'x', 'Baz', 'FOO'] };
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out.tags, ['Foo', 'x', 'Baz', 'Foo']);
    });

    test('unknown keys in obj are left alone; keys in remap but missing in obj set to undefined', () => {
        const input = { color: 'blue' }; // tags missing
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out, { color: 'Blue', tags: undefined });
    });

    test('mutate=true updates object in place and returns same reference', () => {
        const input = { color: 'green', tags: ['foo', 'nope'] };
        const out = applyCorrections(input, REMAP, { mutate: true });
        assert.strictEqual(out, input);
        assert.deepEqual(input, { color: 'Green', tags: ['Foo', 'nope'] });
    });

    test('non-matching values are unchanged (scalar and array)', () => {
        const input = { color: 'violet', tags: ['x', 'y'] };
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out, { color: 'violet', tags: ['x', 'y'] });
    });

    test('mixed casing handled via String(val).toLowerCase()', () => {
        const input = { color: 'ReD', tags: ['fOo', 'baZ'] };
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out, { color: 'Red', tags: ['Foo', 'Baz'] });
    });

    test('returns original object when obj is not a plain object', () => {
        const notPlain = new Date();
        const out = applyCorrections(notPlain, REMAP);
        assert.strictEqual(out, notPlain);
    });

    test('returns original object when remap is falsy', () => {
        const input = { color: 'red' };
        const outNull = applyCorrections(input, null);
        assert.strictEqual(outNull, input);

        const outUndef = applyCorrections(input, undefined);
        assert.strictEqual(outUndef, input);
    });

    test('array field with mixed types handled safely (only strings normalized)', () => {
        const input = { tags: ['FOO', null, undefined, 123, { x: 1 }, 'baz'] };
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out.tags, ['Foo', null, undefined, 123, { x: 1 }, 'Baz']);
    });

    test('missing fields in obj become explicit undefined per implementation', () => {
        const input = {}; // lacks both color and tags
        const out = applyCorrections(input, REMAP);
        assert.deepEqual(out, { color: undefined, tags: undefined });
    });

};
