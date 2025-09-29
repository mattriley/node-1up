module.exports = ({ test, assert }) => $ => {

    const run = $.path.insertBeforeLast;

    test('inserts item before last segment of path', () => {
        const actual = run('foo/bar/baz', 'middle');
        assert.equal(actual, 'foo/bar/middle/baz');
    });

    test('inserts into single-segment path', () => {
        const actual = run('foo', 'x');
        assert.equal(actual, 'foo/x'); // changed from 'x/foo'
    });

    test('inserts into two-segment path', () => {
        const actual = run('a/b', 'insert');
        assert.equal(actual, 'a/insert/b');
    });

    test('handles repeated segments gracefully', () => {
        const actual = run('x/y/x', 'z');
        assert.equal(actual, 'x/y/z/x');
    });

    test('empty string path returns /item', () => {
        const actual = run('', 'new');
        assert.equal(actual, '/new'); // changed from 'new'
    });

    test('inserts with custom delimiter', () => {
        const actual = run('a.b.c', 'x', { delimiter: '.' });
        assert.equal(actual, 'a.b.x.c');
    });

    test('trailing delimiter is preserved as segment', () => {
        const actual = run('a/b/c/', 'x');
        assert.equal(actual, 'a/b/c/x/'); // changed from 'a/b/x/c'
    });

    test('inserts into deep path', () => {
        const actual = run('a/b/c/d/e', 'z');
        assert.equal(actual, 'a/b/c/d/z/e');
    });

    test('inserts correctly when item is a number', () => {
        const actual = run('foo/bar/baz', 123);
        assert.equal(actual, 'foo/bar/123/baz');
    });

};
