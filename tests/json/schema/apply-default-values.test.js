module.exports = ({ test, assert }) => ({ json }) => {

    test('returns original value when obj is not a plain object', () => {
        const schema = {
            properties: {
                title: { type: 'string' }
            }
        };
        const expected = null;
        const actual = json.schema.applyDefaultValues(expected, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema is missing', () => {
        const input = {};
        const expected = input;
        const actual = json.schema.applyDefaultValues(input);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema properties are missing', () => {
        const input = {};
        const schema = {};
        const expected = input;
        const actual = json.schema.applyDefaultValues(input, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns same object reference after applying defaults', () => {
        const input = {};
        const schema = {
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.equal(actual, input);
        assert.deepEqual(actual, { title: '' });
    });

    test('does not overwrite existing values', () => {
        const input = {
            title: 'Hello',
            count: 5,
            enabled: true
        };
        const schema = {
            properties: {
                title: { type: 'string' },
                count: { type: 'number' },
                enabled: { type: 'boolean' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello',
            count: 5,
            enabled: true
        });
    });

    test('uses explicit default when provided', () => {
        const input = {};
        const schema = {
            properties: {
                title: { type: 'string', default: 'Untitled' },
                count: { type: 'number', default: 10 },
                enabled: { type: 'boolean', default: true }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            title: 'Untitled',
            count: 10,
            enabled: true
        });
    });

    test('uses explicit default even when it is undefined', () => {
        const input = {};
        const schema = {
            properties: {
                title: { type: 'string', default: undefined }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.ok('title' in actual);
        assert.equal(actual.title, undefined);
    });

    test('applies string default from type', () => {
        const input = {};
        const schema = {
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            title: ''
        });
    });

    test('applies number default from type', () => {
        const input = {};
        const schema = {
            properties: {
                count: { type: 'number' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            count: 0
        });
    });

    test('applies integer default from type', () => {
        const input = {};
        const schema = {
            properties: {
                count: { type: 'integer' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            count: 0
        });
    });

    test('applies boolean default from type', () => {
        const input = {};
        const schema = {
            properties: {
                enabled: { type: 'boolean' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            enabled: false
        });
    });

    test('applies null default from type', () => {
        const input = {};
        const schema = {
            properties: {
                value: { type: 'null' }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            value: null
        });
    });

    test('applies empty object default from type', () => {
        const input = {};
        const schema = {
            properties: {
                meta: {
                    type: 'object',
                    properties: {}
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            meta: {}
        });
    });

    test('applies nested object defaults recursively', () => {
        const input = {};
        const schema = {
            properties: {
                meta: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        count: { type: 'number' }
                    }
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            meta: {
                title: '',
                count: 0
            }
        });
    });

    test('applies empty array default from type', () => {
        const input = {};
        const schema = {
            properties: {
                tags: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            tags: []
        });
    });

    test('applies array with one default object when items are objects with properties', () => {
        const input = {};
        const schema = {
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            active: { type: 'boolean' }
                        }
                    }
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            items: [
                {
                    name: '',
                    active: false
                }
            ]
        });
    });

    test('uses first recognised type from type array', () => {
        const input = {};
        const schema = {
            properties: {
                value: { type: ['string', 'number', 'boolean'] }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            value: ''
        });
    });

    test('skips unknown types until it finds a recognised one', () => {
        const input = {};
        const schema = {
            properties: {
                value: { type: ['custom', 'integer'] }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            value: 0
        });
    });

    test('uses enum fallback when no known type is handled', () => {
        const input = {};
        const schema = {
            properties: {
                status: {
                    type: ['custom'],
                    enum: ['draft', 'published']
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            status: 'draft'
        });
    });

    test('uses enum fallback when type is missing', () => {
        const input = {};
        const schema = {
            properties: {
                status: {
                    enum: ['draft', 'published']
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            status: 'draft'
        });
    });

    test('does nothing when type is unknown and enum is empty', () => {
        const input = {};
        const schema = {
            properties: {
                status: {
                    type: ['custom'],
                    enum: []
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {});
    });

    test('does nothing when type array is empty', () => {
        const input = {};
        const schema = {
            properties: {
                status: {
                    type: []
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {});
    });

    test('applies defaults for multiple missing properties together', () => {
        const input = {};
        const schema = {
            properties: {
                title: { type: 'string' },
                count: { type: 'integer' },
                enabled: { type: 'boolean' },
                meta: {
                    type: 'object',
                    properties: {
                        label: { type: 'string' }
                    }
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        };

        const actual = json.schema.applyDefaultValues(input, schema);

        assert.deepEqual(actual, {
            title: '',
            count: 0,
            enabled: false,
            meta: {
                label: ''
            },
            tags: []
        });
    });

};
