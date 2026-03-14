module.exports = ({ test, assert }) => ({ json }) => {

    test('returns original value when obj is missing', () => {
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };
        const expected = null;
        const actual = json.schema.removeNonEnumValues(expected, schema);
        assert.deepEqual(actual, expected);
    });

    test('returns original value when schema is missing', () => {
        const input = {
            status: 'draft'
        };
        const expected = input;
        const actual = json.schema.removeNonEnumValues(input);
        assert.deepEqual(actual, expected);
    });

    test('returns same object reference after removing non-enum values', () => {
        const input = {
            status: ['draft', 'invalid', 'published']
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.equal(actual, input);
        assert.deepEqual(actual, {
            status: ['draft', 'published']
        });
    });

    test('removes non-enum values from array properties', () => {
        const input = {
            status: ['draft', 'invalid', 'published', 'other']
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: ['draft', 'published']
        });
    });

    test('keeps enum values when property is a single scalar', () => {
        const input = {
            status: 'draft'
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: ['draft']
        });
    });

    test('removes single scalar value when it is not in enum', () => {
        const input = {
            status: 'invalid'
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: []
        });
    });

    test('replaces missing property with empty array when enum filtering applies', () => {
        const input = {};
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: []
        });
    });

    test('preserves order of allowed enum values', () => {
        const input = {
            status: ['published', 'draft', 'published', 'invalid']
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: ['published', 'draft', 'published']
        });
    });

    test('recurses into nested objects', () => {
        const input = {
            meta: {
                status: ['draft', 'invalid', 'published']
            }
        };
        const schema = {
            properties: {
                meta: {
                    type: 'object',
                    properties: {
                        status: {
                            items: {
                                enum: ['draft', 'published']
                            }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            meta: {
                status: ['draft', 'published']
            }
        });
    });

    test('recurses into array of objects', () => {
        const input = {
            items: [
                { status: ['draft', 'invalid'] },
                { status: ['published', 'other'] },
                { status: ['draft'] }
            ]
        };
        const schema = {
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: {
                                items: {
                                    enum: ['draft', 'published']
                                }
                            }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            items: [
                { status: ['draft'] },
                { status: ['published'] },
                { status: ['draft'] }
            ]
        });
    });

    test('leaves non-object items unchanged in array of objects', () => {
        const input = {
            items: [
                { status: ['draft', 'invalid'] },
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
                            status: {
                                items: {
                                    enum: ['draft', 'published']
                                }
                            }
                        }
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            items: [
                { status: ['draft'] },
                'skip me',
                1,
                null
            ]
        });
    });

    test('does nothing for properties without enum object or array-of-object handling', () => {
        const input = {
            title: 'hello',
            count: 1
        };
        const schema = {
            properties: {
                title: { type: 'string' },
                count: { type: 'number' }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            title: 'hello',
            count: 1
        });
    });

    test('handles multiple enum-filtered properties', () => {
        const input = {
            status: ['draft', 'invalid'],
            category: ['news', 'bad', 'sport']
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                },
                category: {
                    items: {
                        enum: ['news', 'sport']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: ['draft'],
            category: ['news', 'sport']
        });
    });

    test('keeps empty arrays unchanged when enum filtering applies', () => {
        const input = {
            status: []
        };
        const schema = {
            properties: {
                status: {
                    items: {
                        enum: ['draft', 'published']
                    }
                }
            }
        };

        const actual = json.schema.removeNonEnumValues(input, schema);

        assert.deepEqual(actual, {
            status: []
        });
    });

};
