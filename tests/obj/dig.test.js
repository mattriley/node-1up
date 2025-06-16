module.exports = ({ test, assert }) => ({ obj }) => {

    test('combination of path lengths with no result', () => {
        const expected = 1;
        const input = {};
        const actual = obj.dig(input, 'a.b.c.d.e.f', expected);
        assert.deepEqual(actual, expected);
    });

    test('combination of path lengths with one result', () => {
        const expected = 1;
        const input = { 'a.b': { 'c': { 'd.e.f': expected } } };
        const actual = obj.dig(input, 'a.b.c.d.e.f');
        assert.deepEqual(actual, expected);
    });

    test('combination of path lengths with two results', () => {
        const expectedFirst = 1;
        const expectedSecond = 2;
        const input = {
            'a.b': { 'c': { 'd.e.f': expectedFirst } },
            'a': { 'b.c.d': { 'e.f': expectedSecond } }
        };
        const actual = obj.dig(input, 'a.b.c.d.e.f');
        assert.deepEqual(actual.sort(), [expectedFirst, expectedSecond].sort());
    });

};
