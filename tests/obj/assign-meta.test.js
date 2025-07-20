module.exports = ({ test, assert }) => ({ obj }) => {

    const assignMetaCustom = obj.configure.assignMeta({ length: 'len', some: 'any', exists: 'has' });

    test('array with id-based objects only adds length', () => {
        const input = {
            items: [{ id: 'x' }, { id: 'y' }]
        };
        const expected = {
            items: [{ id: 'x' }, { id: 'y' }],
            'items.length': 2
        };

        const actual = obj.assignMeta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('array of primitives adds length, some, and exists keys', () => {
        const input = {
            items: ['a', 'b']
        };
        const expected = {
            items: ['a', 'b'],
            'items.length': 2,
            'items.some': true,
            'items.a.exists': true,
            'items.b.exists': true
        };

        const actual = obj.assignMeta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('mixed input: non-array fields are ignored', () => {
        const input = {
            count: 5,
            tags: ['x'],
            config: null
        };
        const expected = {
            count: 5,
            tags: ['x'],
            config: null,
            'tags.length': 1,
            'tags.some': true,
            'tags.x.exists': true
        };

        const actual = obj.assignMeta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('empty array still adds length and sets some to false', () => {
        const input = {
            list: []
        };
        const expected = {
            list: [],
            'list.length': 0,
            'list.some': false
        };

        const actual = obj.assignMeta({ ...input });
        assert.deepEqual(actual, expected);
    });

    test('custom config renames keys correctly', () => {
        const input = {
            files: ['doc', 'img']
        };
        const expected = {
            files: ['doc', 'img'],
            'files.len': 2,
            'files.any': true,
            'files.doc.has': true,
            'files.img.has': true
        };

        const actual = assignMetaCustom({ ...input });
        assert.deepEqual(actual, expected);
    });
};
