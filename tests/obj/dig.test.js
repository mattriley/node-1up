module.exports = ({ test, assert }) => ({ obj }) => {

    test('combination of path lengths with no result', () => {
        const expected = 1;
        const input = {};
        const actual = obj.dig(input, 'a.b.c.d.e.f', { defaultValue: expected });
        assert.deepEqual(actual, expected);
    });

    test('combination of path lengths with one result', () => {
        const expected = 1;
        const input = { 'a.b': { 'c': { 'd.e.f': expected } } };
        const actual = obj.dig(input, 'a.b.c.d.e.f');
        assert.deepEqual(actual, expected);
    });

    test('throws if path resolution is ambiguous due to overlapping keys', () => {
        const input = {
            'a.b': { c: { 'd.e.f': 1 } },
            a: { 'b.c.d': { 'e.f': 2 } }
        };

        assert.throws(
            () => obj.dig(input, 'a.b.c.d.e.f'),
            err =>
                err instanceof Error &&
                err.message === '[dig] Found multiple matches for path "a.b.c.d.e.f": 2 results'
        );
    });



    test('path not found with default value', () => {

        const input = {
            exifr: {
                id: 'exifr:10ef5f3c-3bc3-4af2-8de7-1689fb4d1307',
                partitionKey: undefined
            },
            'exifr.extract': {
                id: 'exifr.extract:10ef5f3c-3bc3-4af2-8de7-1689fb4d1307',
                partitionKey: undefined
            },
            category: {
                id: 'category:10c3734271ab373bcd6f4661f8313d62d9897c86',
                partitionKey: 'Uncategorised'
            }
        };

        const actual = obj.dig(input, 'import', { defaultValue: {} });
        assert.deepEqual(actual, {});
    });

};
