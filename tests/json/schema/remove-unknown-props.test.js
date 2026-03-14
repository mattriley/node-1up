module.exports = ({ test, assert }) => ({ json }) => {

    test('returns original value when obj is not a plain object', () => {
        const schema = {
            properties: {
                title: { type: 'string' }
            }
        };
        const expected = null;
        const actual = json.schema.removeUnknownProps(expected, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema is missing', () => {
        const input = {
            title: 'Hello',
            extra: true
        };
        const expected = input;
        const actual = json.schema.removeUnknownProps(input);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema properties are missing', () => {
        const input = {
            title: 'Hello',
            extra: true
        };
        const schema = {};
        const expected = input;
        const actual = json.schema.removeUnknownProps(input, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns same object reference after removing unknown properties', () => {
        const input = {
            title: 'Hello',
            extra: true
        };
        const schema = {
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.equal(actual, input);
        assert.deepEqual(actual, {
            title: 'Hello'
        });
    });

    test('removes unknown top-level properties', () => {
        const input = {
            title: 'Hello',
            count: 1,
            extra: true,
            debug: 'x'
        };
        const schema = {
            properties: {
                title: { type: 'string' },
                count: { type: 'number' }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello',
            count: 1
        });
    });

    test('keeps known top-level properties', () => {
        const input = {
            title: 'Hello',
            count: 1
        };
        const schema = {
            properties: {
                title: { type: 'string' },
                count: { type: 'number' }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello',
            count: 1
        });
    });

    test('removes unknown properties from nested objects', () => {
        const input = {
            meta: {
                title: 'Hello',
                extra: true
            },
            keep: 'yes'
        };
        const schema = {
            properties: {
                meta: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' }
                    }
                },
                keep: { type: 'string' }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            meta: {
                title: 'Hello'
            },
            keep: 'yes'
        });
    });

    test('keeps known properties in nested objects', () => {
        const input = {
            meta: {
                title: 'Hello',
                count: 1
            }
        };
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

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            meta: {
                title: 'Hello',
                count: 1
            }
        });
    });

    test('removes unknown properties from objects inside arrays', () => {
        const input = {
            items: [
                { title: 'One', extra: true },
                { title: 'Two', debug: 'x' }
            ]
        };
        const schema = {
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            items: [
                { title: 'One' },
                { title: 'Two' }
            ]
        });
    });

    test('keeps non-object items unchanged in arrays of objects', () => {
        const input = {
            items: [
                { title: 'One', extra: true },
                'skip me',
                1,
                null
            ]
        };
        const schema = {
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            items: [
                { title: 'One' },
                'skip me',
                1,
                null
            ]
        });
    });

    test('recurses through nested objects inside arrays', () => {
        const input = {
            items: [
                {
                    meta: {
                        title: 'One',
                        extra: true
                    },
                    extra: true
                }
            ]
        };
        const schema = {
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            meta: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            items: [
                {
                    meta: {
                        title: 'One'
                    }
                }
            ]
        });
    });

    test('removes unknown nested object properties but does not remove known parent key', () => {
        const input = {
            meta: {
                extra: true
            }
        };
        const schema = {
            properties: {
                meta: {
                    type: 'object',
                    properties: {}
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            meta: {}
        });
    });

    test('removes all top-level properties when schema allows none', () => {
        const input = {
            title: 'Hello',
            count: 1
        };
        const schema = {
            properties: {}
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {});
    });

    test('does not recurse into plain object when schema type is not object', () => {
        const input = {
            meta: {
                title: 'Hello',
                extra: true
            }
        };
        const schema = {
            properties: {
                meta: {
                    type: 'string',
                    properties: {
                        title: { type: 'string' }
                    }
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            meta: {
                title: 'Hello',
                extra: true
            }
        });
    });

    test('does not recurse into array when schema items type is not object', () => {
        const input = {
            tags: ['a', 'b', 'c']
        };
        const schema = {
            properties: {
                tags: {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            tags: ['a', 'b', 'c']
        });
    });

    test('removes unknown properties from multiple branches together', () => {
        const input = {
            title: 'Hello',
            extra: true,
            meta: {
                count: 1,
                debug: 'x'
            },
            items: [
                { name: 'A', other: 1 },
                { name: 'B', other: 2 }
            ]
        };
        const schema = {
            properties: {
                title: { type: 'string' },
                meta: {
                    type: 'object',
                    properties: {
                        count: { type: 'number' }
                    }
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeUnknownProps(input, schema);

        assert.deepEqual(actual, {
            title: 'Hello',
            meta: {
                count: 1
            },
            items: [
                { name: 'A' },
                { name: 'B' }
            ]
        });
    });

};
