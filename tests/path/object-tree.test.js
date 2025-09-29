
module.exports = ({ test, assert }) => $ => {

    const run = $.path.objectTree;

    test('basic paths expanded to object hierarchy', () => {
        const actual = run(['foo/bar', 'foo/baz', 'baz/qux']);
        const expected = {
            foo: { bar: {}, baz: {} },
            baz: { qux: {} }
        };
        assert.deepEqual(actual, expected);
    });

    test('empty path list returns empty object', () => {
        const actual = run([]);
        assert.deepEqual(actual, {});
    });

    test('single path produces correct nested object', () => {
        const actual = run(['a/b/c']);
        const expected = { a: { b: { c: {} } } };
        assert.deepEqual(actual, expected);
    });

    test('duplicate paths are handled gracefully', () => {
        const actual = run(['a/b', 'a/b']);
        const expected = { a: { b: {} } };
        assert.deepEqual(actual, expected);
    });

    test('overlapping and nested paths handled correctly', () => {
        const actual = run(['a/b', 'a/b/c', 'a/b/c/d']);
        const expected = { a: { b: { c: { d: {} } } } };
        assert.deepEqual(actual, expected);
    });

    test('sibling subpaths handled independently', () => {
        const actual = run(['a/b/c', 'a/b/d', 'a/b/e']);
        const expected = { a: { b: { c: {}, d: {}, e: {} } } };
        assert.deepEqual(actual, expected);
    });

    test('multiple top-level branches', () => {
        const actual = run(['x/y/z', 'm/n/o']);
        const expected = {
            x: { y: { z: {} } },
            m: { n: { o: {} } }
        };
        assert.deepEqual(actual, expected);
    });

    test('trailing slashes are treated normally', () => {
        const actual = run(['foo/bar/', 'foo/bar/baz/']);
        const expected = { foo: { bar: { baz: {} } } };
        assert.deepEqual(actual, expected);
    });

    test('handles paths with single segment', () => {
        const actual = run(['top']);
        const expected = { top: {} };
        assert.deepEqual(actual, expected);
    });

    test('mixed shallow and deep paths', () => {
        const actual = run(['a', 'a/b', 'a/b/c']);
        const expected = { a: { b: { c: {} } } };
        assert.deepEqual(actual, expected);
    });

};
