module.exports = ({ test, assert }) => ({ json }) => {

    test('returns hasSchema false when schema is missing', () => {
        const expected = { hasSchema: false };
        const actual = json.flexischema.parse();
        assert.deepEqual(actual, expected);
    });

    test('invokes schema when schema is a function', () => {
        const input = () => ({
            properties: {
                title: { type: 'string' }
            }
        });

        const actual = json.flexischema.parse(input);

        assert.equal(actual.hasSchema, true);
        assert.equal(actual.schema.properties.title.key, 'title');
    });

    test('applies default root schema values', () => {
        const input = {
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.equal(actual.schema.type, 'object');
        assert.deepEqual(actual.schema.required, []);
        assert.equal(actual.schema.additionalProperties, false);
        assert.deepEqual(Object.keys(actual.schema.properties), ['title']);
    });

    test('preserves explicit root schema values over defaults', () => {
        const input = {
            type: 'array',
            required: ['title'],
            additionalProperties: true,
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.equal(actual.schema.type, 'array');
        assert.deepEqual(actual.schema.required, ['title']);
        assert.equal(actual.schema.additionalProperties, true);
    });

    test('adds key to each schema property', () => {
        const input = {
            properties: {
                title: { type: 'string' },
                tags: { type: 'array' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.equal(actual.schema.properties.title.key, 'title');
        assert.equal(actual.schema.properties.tags.key, 'tags');
    });

    test('normalises array properties to string or array', () => {
        const input = {
            properties: {
                tags: { type: 'array' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.deepEqual(actual.schema.properties.tags.type, ['string', 'array']);
    });

    test('does not change non-array property types', () => {
        const input = {
            properties: {
                title: { type: 'string' },
                meta: { type: 'object' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.equal(actual.schema.properties.title.type, 'string');
        assert.equal(actual.schema.properties.meta.type, 'object');
    });

    test('adds default string item type to array properties', () => {
        const input = {
            properties: {
                tags: { type: 'array' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.deepEqual(actual.schema.properties.tags.items, { type: 'string' });
    });

    test('merges provided items over default string item type', () => {
        const input = {
            properties: {
                tags: {
                    type: 'array',
                    items: { minLength: 2 }
                },
                codes: {
                    type: 'array',
                    items: { type: 'number' }
                }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.deepEqual(actual.schema.properties.tags.items, {
            type: 'string',
            minLength: 2
        });

        assert.deepEqual(actual.schema.properties.codes.items, {
            type: 'number'
        });
    });

    test('builds alias list from key alias and name', () => {
        const input = {
            properties: {
                title: {
                    type: 'string',
                    alias: ['heading', 'label'],
                    name: 'displayTitle'
                }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.deepEqual(actual.schema.properties.title.alias, [
            'title',
            'heading',
            'label',
            'displayTitle'
        ]);
    });

    test('creates alias list with only key when alias and name are missing', () => {
        const input = {
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.deepEqual(actual.schema.properties.title.alias, ['title']);
    });

    test('creates props entries for key and aliases', () => {
        const input = {
            properties: {
                title: {
                    type: 'string',
                    alias: ['heading', 'label'],
                    name: 'displayTitle'
                }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.ok('title' in actual.props);
        assert.ok('heading' in actual.props);
        assert.ok('label' in actual.props);
        assert.ok('displayTitle' in actual.props);

        assert.equal(actual.props.title.key, 'title');
        assert.equal(actual.props.heading.key, 'title');
        assert.equal(actual.props.label.key, 'title');
        assert.equal(actual.props.displayTitle.key, 'title');
    });

    test('props alias entries retain original property metadata', () => {
        const input = {
            properties: {
                tags: {
                    type: 'array',
                    alias: ['tag'],
                    name: 'labels'
                }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.deepEqual(actual.props.tags.type, ['string', 'array']);
        assert.deepEqual(actual.props.tag.type, ['string', 'array']);
        assert.deepEqual(actual.props.labels.type, ['string', 'array']);

        assert.deepEqual(actual.props.tags.alias, ['tags', 'tag', 'labels']);
        assert.deepEqual(actual.props.tag.alias, ['tags', 'tag', 'labels']);
        assert.deepEqual(actual.props.labels.alias, ['tags', 'tag', 'labels']);
    });

    test('assigns array default factory for array properties', () => {
        const input = {
            properties: {
                tags: { type: 'array' }
            }
        };

        const actual = json.flexischema.parse(input);
        const expected = [];

        assert.deepEqual(actual.schema.properties.tags.getDefault(), expected);
        assert.notStrictEqual(
            actual.schema.properties.tags.getDefault(),
            actual.schema.properties.tags.getDefault()
        );
    });

    test('assigns object default factory for object properties', () => {
        const input = {
            properties: {
                meta: { type: 'object' }
            }
        };

        const actual = json.flexischema.parse(input);
        const expected = {};

        assert.deepEqual(actual.schema.properties.meta.getDefault(), expected);
        assert.notStrictEqual(
            actual.schema.properties.meta.getDefault(),
            actual.schema.properties.meta.getDefault()
        );
    });

    test('assigns string default factory for string properties', () => {
        const input = {
            properties: {
                title: { type: 'string' }
            }
        };

        const actual = json.flexischema.parse(input);
        const expected = '';

        assert.deepEqual(actual.schema.properties.title.getDefault(), expected);
    });

    test('assigns array default factory when type includes array', () => {
        const input = {
            properties: {
                tags: { type: ['array', 'null'] }
            }
        };

        const actual = json.flexischema.parse(input);
        const expected = [];

        assert.deepEqual(actual.schema.properties.tags.getDefault(), expected);
    });

    test('assigns object default factory when type includes object', () => {
        const input = {
            properties: {
                meta: { type: ['null', 'object'] }
            }
        };

        const actual = json.flexischema.parse(input);
        const expected = {};

        assert.deepEqual(actual.schema.properties.meta.getDefault(), expected);
    });

    test('assigns string default factory when type includes string', () => {
        const input = {
            properties: {
                title: { type: ['null', 'string'] }
            }
        };

        const actual = json.flexischema.parse(input);
        const expected = '';

        assert.deepEqual(actual.schema.properties.title.getDefault(), expected);
    });

    test('leaves getDefault undefined when type has no supported default', () => {
        const input = {
            properties: {
                count: { type: 'number' }
            }
        };

        const actual = json.flexischema.parse(input);

        assert.equal(actual.schema.properties.count.getDefault, undefined);
    });

    test('returns empty props object when schema has no properties', () => {
        const input = {
            properties: {}
        };

        const actual = json.flexischema.parse(input);
        const expected = {};

        assert.deepEqual(actual.props, expected);
    });

};
