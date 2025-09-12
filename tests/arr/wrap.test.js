module.exports = ({ test, assert }) => ({ arr }) => {

    // basic fits
    test('all items fit on one line', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 20);
        const expected = [['foo bar', 'baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('exact fit (includes the space between items)', () => {
        // 'foo bar' (7) + space (1) + 'baz' (3) = 11
        const actual = arr.wrap(['foo bar', 'baz'], 11);
        const expected = [['foo bar', 'baz']];
        assert.deepEqual(actual, expected);
    });

    // wrapping around boundaries
    test('limit equal to first item length -> second wraps', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 7);
        const expected = [['foo bar'], ['baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('limit less than first item length -> each alone', () => {
        const actual = arr.wrap(['foo bar', 'baz qux'], 5);
        const expected = [['foo bar'], ['baz qux']];
        assert.deepEqual(actual, expected);
    });

    test('wrap when adding next would exceed limit', () => {
        // 'alpha'(5) + space + 'beta'(4) = 10 fits in 11; adding 'gamma'(5) would exceed -> wrap
        const actual = arr.wrap(['alpha', 'beta', 'gamma'], 11);
        const expected = [['alpha', 'beta'], ['gamma']];
        assert.deepEqual(actual, expected);
    });

    test('combine small items until limit, then wrap', () => {
        // 'a'(1) + space + 'b'(1) = 3 fits; adding 'c'(1) would exceed 3 -> wrap
        const actual = arr.wrap(['a', 'b', 'c'], 3);
        const expected = [['a', 'b'], ['c']];
        assert.deepEqual(actual, expected);
    });

    // degenerate / edge limits
    test('zero limit -> each item on its own line', () => {
        const actual = arr.wrap(['foo', 'bar'], 0);
        const expected = [['foo'], ['bar']];
        assert.deepEqual(actual, expected);
    });

    test('negative limit -> each item on its own line', () => {
        const actual = arr.wrap(['foo', 'bar'], -1);
        const expected = [['foo'], ['bar']];
        assert.deepEqual(actual, expected);
    });

    // misc
    test('single long item longer than limit stays alone', () => {
        const actual = arr.wrap(['supercalifragilisticexpialidocious'], 10);
        const expected = [['supercalifragilisticexpialidocious']];
        assert.deepEqual(actual, expected);
    });

    test('empty input yields one empty line (current contract)', () => {
        const actual = arr.wrap([], 10);
        const expected = [[]];
        assert.deepEqual(actual, expected);
    });

};
