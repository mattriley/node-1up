module.exports = ({ test, assert }) => ({ obj }) => {

    const metaCustom = obj.configure.meta({ length: 'len', some: 'any', exists: 'has' });

    test('array with id-based objects only adds length', () => {
        const input = {
            items: [{ id: 'x' }, { id: 'y' }]
        };
        const expected = {
            'items.length': 2
        };

        const actual = obj.meta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('array of primitives adds length, some, and exists keys', () => {
        const input = {
            items: ['a', 'b']
        };
        const expected = {
            'items.length': 2,
            'items.some': true,
            'items.a.exists': true,
            'items.b.exists': true
        };

        const actual = obj.meta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('mixed input: non-array fields are ignored', () => {
        const input = {
            count: 5,
            tags: ['x'],
            config: null
        };
        const expected = {
            'tags.length': 1,
            'tags.some': true,
            'tags.x.exists': true
        };

        const actual = obj.meta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('empty array still adds length and sets some to false', () => {
        const input = {
            list: []
        };
        const expected = {
            'list.length': 0,
            'list.some': false
        };

        const actual = obj.meta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('custom config renames keys correctly', () => {
        const input = {
            files: ['doc', 'img']
        };
        const expected = {
            'files.len': 2,
            'files.any': true,
            'files.doc.has': true,
            'files.img.has': true
        };

        const actual = metaCustom({ ...input });
        assert.deepEqual(actual, expected);
    });
};
