module.exports = ({ test, assert, compose }) => () => {

    test('writes .json with configured indentation', async () => {
        const filepath = '/tmp/data.json';
        const data = { a: 1 };
        let done = false;

        const { fsx } = compose({
            overrides: {
                fsp: {
                    writeFile: (path, txt) => {
                        done = true;
                        assert.equal(path, filepath);
                        assert.equal(txt, JSON.stringify(data, null, 4));
                    }
                }
            }
        });

        await fsx.writeJsonLike(filepath, data);
        assert.equal(done, true);
    });

    test('throws for unsupported extension', async () => {
        const { fsx } = compose();
        await assert.rejects(
            () => fsx.writeJsonLike('/tmp/data.txt', { a: 1 }),
            /Unrecognised JSON-like extension/
        );
    });

};
