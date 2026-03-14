module.exports = ({ test, assert }) => ({ json }) => {

    test('returns original value when obj is not a plain object', () => {
        const schema = {
            properties: {
                tags: { uniqueItems: true }
            }
        };
        const expected = null;
        const actual = json.schema.removeDuplicateValues(expected, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema is missing', () => {
        const input = {
            tags: ['a', 'a', 'b']
        };
        const expected = input;
        const actual = json.schema.removeDuplicateValues(input);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema properties are missing', () => {
        const input = {
            tags: ['a', 'a', 'b']
        };
        const schema = {};
        const expected = input;
        const actual = json.schema.removeDuplicateValues(input, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns same object reference after removing duplicate values', () => {
        const input = {
            tags: ['a', 'a', 'b']
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.equal(actual, input);
        assert.deepEqual(actual, {
            tags: ['a', 'b']
        });
    });

    test('removes duplicate values when uniqueItems is true', () => {
        const input = {
            tags: ['a', 'a', 'b', 'a', 'c', 'b']
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: ['a', 'b', 'c']
        });
    });

    test('preserves first occurrence order when removing duplicates', () => {
        const input = {
            tags: ['b', 'a', 'b', 'c', 'a']
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: ['b', 'a', 'c']
        });
    });

    test('does not change values when uniqueItems is false', () => {
        const input = {
            tags: ['a', 'a', 'b']
        };
        const schema = {
            properties: {
                tags: { uniqueItems: false }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: ['a', 'a', 'b']
        });
    });

    test('does not change values when uniqueItems is missing', () => {
        const input = {
            tags: ['a', 'a', 'b']
        };
        const schema = {
            properties: {
                tags: {}
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: ['a', 'a', 'b']
        });
    });

    test('removes duplicates from multiple properties marked uniqueItems', () => {
        const input = {
            tags: ['a', 'a', 'b'],
            ids: [1, 2, 1, 3, 2],
            title: 'hello'
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true },
                ids: { uniqueItems: true },
                title: { uniqueItems: false }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: ['a', 'b'],
            ids: [1, 2, 3],
            title: 'hello'
        });
    });

    test('ignores schema properties not present on the object', () => {
        const input = {
            title: 'hello'
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            title: 'hello',
            tags: []
        });
    });

    test('replaces undefined property with empty array when uniqueItems is true', () => {
        const input = {
            tags: undefined
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: []
        });
    });

    test('does not recurse into nested objects', () => {
        const input = {
            tags: ['a', 'a', 'b'],
            meta: {
                tags: ['x', 'x', 'y']
            }
        };
        const schema = {
            properties: {
                tags: { uniqueItems: true },
                meta: {
                    properties: {
                        tags: { uniqueItems: true }
                    }
                }
            }
        };

        const actual = json.schema.removeDuplicateValues(input, schema);

        assert.deepEqual(actual, {
            tags: ['a', 'b'],
            meta: {
                tags: ['x', 'x', 'y']
            }
        });
    });

};
