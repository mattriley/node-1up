// Tests expanded with help of ChatGPT.

module.exports = ({ test, assert }) => lib => {

    test('basic paths expanded to object hierarchy', () => {
        const actual = lib.path.objectTree(['foo/bar', 'foo/baz', 'baz/qux']);
        const expected = {
            foo: { bar: {}, baz: {} },
            baz: { qux: {} }
        };
        assert.deepEqual(actual, expected);
    });

    test('empty path list returns empty object', () => {
        const actual = lib.path.objectTree([]);
        assert.deepEqual(actual, {});
    });

    test('single path produces correct nested object', () => {
        const actual = lib.path.objectTree(['a/b/c']);
        const expected = { a: { b: { c: {} } } };
        assert.deepEqual(actual, expected);
    });

    test('duplicate paths are handled gracefully', () => {
        const actual = lib.path.objectTree(['a/b', 'a/b']);
        const expected = { a: { b: {} } };
        assert.deepEqual(actual, expected);
    });

    test('overlapping and nested paths handled correctly', () => {
        const actual = lib.path.objectTree(['a/b', 'a/b/c', 'a/b/c/d']);
        const expected = { a: { b: { c: { d: {} } } } };
        assert.deepEqual(actual, expected);
    });

    test('sibling subpaths handled independently', () => {
        const actual = lib.path.objectTree(['a/b/c', 'a/b/d', 'a/b/e']);
        const expected = { a: { b: { c: {}, d: {}, e: {} } } };
        assert.deepEqual(actual, expected);
    });

    test('multiple top-level branches', () => {
        const actual = lib.path.objectTree(['x/y/z', 'm/n/o']);
        const expected = {
            x: { y: { z: {} } },
            m: { n: { o: {} } }
        };
        assert.deepEqual(actual, expected);
    });

    test('trailing slashes are treated normally', () => {
        const actual = lib.path.objectTree(['foo/bar/', 'foo/bar/baz/']);
        const expected = { foo: { bar: { baz: {} } } };
        assert.deepEqual(actual, expected);
    });

    test('handles paths with single segment', () => {
        const actual = lib.path.objectTree(['top']);
        const expected = { top: {} };
        assert.deepEqual(actual, expected);
    });

    test('mixed shallow and deep paths', () => {
        const actual = lib.path.objectTree(['a', 'a/b', 'a/b/c']);
        const expected = { a: { b: { c: {} } } };
        assert.deepEqual(actual, expected);
    });

};
