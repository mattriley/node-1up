module.exports = ({ test, assert, compose }) => () => {

    test('reads and parses JSON file', async () => {
        const filepath = '/tmp/data.json';
        const { fsx } = compose({
            overrides: {
                fsp: {
                    readFile: (path, encoding) => {
                        assert.equal(path, filepath);
                        assert.equal(encoding, 'utf8');
                        return '{\"foo\":\"bar\"}';
                    }
                }
            }
        });

        const actual = await fsx.readJson(filepath);
        assert.deepEqual(actual, { foo: 'bar' });
    });

};
