module.exports = ({ test, assert }) => $ => {

    const run = $.path.steps;

    test('POSIX: simple relative path', () => {
        const input = 'a/b/c';
        const out = run(input, '/');
        assert.deepEqual(out, ['a', 'a/b', 'a/b/c']);
    });

    test('POSIX: leading slash is ignored (no empty prefix)', () => {
        const input = '/a/b';
        const out = run(input, '/');
        assert.deepEqual(out, ['a', 'a/b']);
    });

    test('POSIX: trailing slash is ignored', () => {
        const input = 'a/b/';
        const out = run(input, '/');
        assert.deepEqual(out, ['a', 'a/b']);
    });

    test('POSIX: repeated separators are collapsed', () => {
        const input = 'a//b///c';
        const out = run(input, '/');
        assert.deepEqual(out, ['a', 'a/b', 'a/b/c']);
    });

    test('POSIX: root only → empty list', () => {
        const input = '/';
        const out = run(input, '/');
        assert.deepEqual(out, []);
    });

    test('empty string → empty list', () => {
        const input = '';
        const out = run(input, '/');
        assert.deepEqual(out, []);
    });

    test('Windows-style: backslash separator', () => {
        const input = 'a\\b\\c';
        const out = run(input, '\\');
        assert.deepEqual(out, ['a', 'a\\b', 'a\\b\\c']);
    });

    test('Windows-style: leading/trailing/multiple backslashes collapsed', () => {
        const input = '\\\\a\\\\b\\c\\\\';
        const out = run(input, '\\');
        assert.deepEqual(out, ['a', 'a\\b', 'a\\b\\c']);
    });

    test('Custom separator ":" (e.g., PATH-like)', () => {
        const input = 'a:b::c';
        const out = run(input, ':');
        assert.deepEqual(out, ['a', 'a:b', 'a:b:c']);
    });

};
