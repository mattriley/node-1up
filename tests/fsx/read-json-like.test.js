module.exports = ({ test, assert, compose }) => () => {

    test('reads and parses .json file', async () => {
        const filepath = '/tmp/data.json';
        const { fsx } = compose({
            overrides: {
                fsp: {
                    readFile: (path, enc) => {
                        assert.equal(path, filepath);
                        assert.equal(enc, 'utf8');
                        return '{\"a\":1}';
                    }
                }
            }
        });

        const actual = await fsx.readJsonLike(filepath);
        assert.deepEqual(actual, { a: 1 });
    });

    test('throws for unsupported extension', async () => {
        const { fsx } = compose();
        await assert.rejects(
            () => fsx.readJsonLike('/tmp/data.txt'),
            /Unrecognised JSON-like extension/
        );
    });

};
