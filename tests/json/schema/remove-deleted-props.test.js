module.exports = ({ test, assert }) => ({ json }) => {

    test('returns original value when obj is not a plain object', () => {
        const schema = {
            properties: {
                title: { delete: true }
            }
        };
        const expected = null;
        const actual = json.schema.removeDeletedProps(expected, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema is missing', () => {
        const input = {
            title: 'Hello'
        };
        const expected = input;
        const actual = json.schema.removeDeletedProps(input);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema properties are missing', () => {
        const input = {
            title: 'Hello'
        };
        const schema = {};
        const expected = input;
        const actual = json.schema.removeDeletedProps(input, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns same object reference after deleting properties', () => {
        const input = {
            title: 'Hello',
            secret: 'remove me'
        };
        const schema = {
            properties: {
                secret: { delete: true }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.equal(actual, input);
        assert.deepEqual(actual, {
            title: 'Hello'
        });
    });

    test('deletes a property when delete is true', () => {
        const input = {
            title: 'Hello',
            secret: 'remove me'
        };
        const schema = {
            properties: {
                secret: { delete: true }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello'
        });
    });

    test('does not delete a property when delete is false', () => {
        const input = {
            title: 'Hello'
        };
        const schema = {
            properties: {
                title: { delete: false }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello'
        });
    });

    test('does not delete a property when delete is missing', () => {
        const input = {
            title: 'Hello'
        };
        const schema = {
            properties: {
                title: {}
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello'
        });
    });

    test('deletes multiple properties marked for deletion', () => {
        const input = {
            title: 'Hello',
            secret: 'remove me',
            internal: true,
            visible: 'keep me'
        };
        const schema = {
            properties: {
                secret: { delete: true },
                internal: { delete: true },
                visible: { delete: false }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello',
            visible: 'keep me'
        });
    });

    test('ignores schema properties not present on the object', () => {
        const input = {
            title: 'Hello'
        };
        const schema = {
            properties: {
                missing: { delete: true }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello'
        });
    });

    test('deletes property even when value is undefined', () => {
        const input = {
            title: 'Hello',
            secret: undefined
        };
        const schema = {
            properties: {
                secret: { delete: true }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello'
        });
        assert.equal('secret' in actual, false);
    });

    test('does not recurse into nested objects', () => {
        const input = {
            meta: {
                secret: 'keep me'
            },
            secret: 'remove me'
        };
        const schema = {
            properties: {
                secret: { delete: true },
                meta: {
                    properties: {
                        secret: { delete: true }
                    }
                }
            }
        };

        const actual = json.schema.removeDeletedProps(input, schema);

        assert.deepEqual(actual, {
            meta: {
                secret: 'keep me'
            }
        });
    });

};
