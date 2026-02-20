module.exports = ({ test, assert }) => ({ fun }) => {

    const parseConfig = fun.parseConfig;

    test('merges defaults, config, and options in precedence order', () => {
        const defaults = { a: 1, b: 2, c: 3 };
        const config = { b: 20 };

        const run = parseConfig(defaults, config);
        const actual = run({ c: 30 });
        const expected = { a: 1, b: 20, c: 30 };

        assert.deepEqual(actual, expected);
    });

    test('drops undefined values from config and options', () => {
        const run = parseConfig({ a: 1, b: 2 }, { a: undefined });
        const actual = run({ b: undefined });
        const expected = { a: 1, b: 2 };
        assert.deepEqual(actual, expected);
    });

    test('throws for unknown option keys', () => {
        const run = parseConfig({ a: 1 }, {});
        assert.throws(() => run({ b: 2 }), /Unknown option key: "b"/);
    });

    test('throws when defaults, config, or options are not plain objects', () => {
        assert.throws(() => parseConfig(null, {}), /"defaults" must be a plain object/);
        assert.throws(() => parseConfig({}, []), /"config" must be a plain object/);
        assert.throws(() => parseConfig({ a: 1 }, {})('x'), /"options" must be a plain object/);
    });

};
