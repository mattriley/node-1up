module.exports = ({ test, assert }) => lib => {

    // ── default (immutable) behavior ─────────────────────────────────────────

    test('immutable: inserts before last when length ≥ 2', () => {
        const actual = lib.arr.insertBeforeLast(['foo', 'bar', 'qux'], 'baz');
        assert.deepEqual(actual, ['foo', 'bar', 'baz', 'qux']);
    });

    test('immutable: length == 2 inserts at index 1', () => {
        const actual = lib.arr.insertBeforeLast(['a', 'c'], 'b');
        assert.deepEqual(actual, ['a', 'b', 'c']);
    });

    test('immutable: length == 1 appends at end', () => {
        const actual = lib.arr.insertBeforeLast(['foo'], 'bar');
        assert.deepEqual(actual, ['foo', 'bar']);
    });

    test('immutable: empty array → single item array', () => {
        const actual = lib.arr.insertBeforeLast([], 'x');
        assert.deepEqual(actual, ['x']);
    });

    test('immutable: does not mutate input array', () => {
        const input = ['x', 'y', 'z'];
        const copy = input.slice();
        const out = lib.arr.insertBeforeLast(input, 'M');
        assert.deepEqual(input, copy);                // original unchanged
        assert.deepEqual(out, ['x', 'y', 'M', 'z']);  // result correct
    });

    test('immutable: preserves object reference for inserted item', () => {
        const obj = { id: 1 };
        const out = lib.arr.insertBeforeLast(['a', 'c'], obj);
        assert.strictEqual(out[1], obj); // same object, not cloned
    });


    // ── mutate behavior ──────────────────────────────────────────────────────

    test('mutate: inserts before last when length ≥ 2 (same reference)', () => {
        const input = ['foo', 'bar', 'qux'];
        const actual = lib.arr.insertBeforeLast(input, 'baz', { mutate: true });
        assert.strictEqual(actual, input); // same array instance
        assert.deepEqual(input, ['foo', 'bar', 'baz', 'qux']);
    });

    test('mutate: length == 2 inserts at index 1', () => {
        const input = ['a', 'c'];
        lib.arr.insertBeforeLast(input, 'b', { mutate: true });
        assert.deepEqual(input, ['a', 'b', 'c']);
    });

    test('mutate: length == 1 appends at end', () => {
        const input = ['foo'];
        lib.arr.insertBeforeLast(input, 'bar', { mutate: true });
        assert.deepEqual(input, ['foo', 'bar']);
    });

    test('mutate: empty array → single item array', () => {
        const input = [];
        lib.arr.insertBeforeLast(input, 'x', { mutate: true });
        assert.deepEqual(input, ['x']);
    });

    test('mutate: preserves object reference for inserted item', () => {
        const obj = { id: 42 };
        const input = ['a', 'c'];
        lib.arr.insertBeforeLast(input, obj, { mutate: true });
        assert.strictEqual(input[1], obj);
    });

};
