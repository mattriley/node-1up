module.exports = ({ test, assert, compose }) => () => {

    test('writes JSON with default indent', async () => {
        const filepath = '/tmp/out.json';
        const data = { foo: 'bar' };
        let done = false;

        const { fsx } = compose({
            overrides: {
                fsx: {
                    mkdirp: () => {}
                },
                fsp: {
                    writeFile: (path, txt) => {
                        done = true;
                        assert.equal(path, filepath);
                        assert.equal(txt, JSON.stringify(data, null, 4));
                    }
                }
            }
        });

        await fsx.writeJson(filepath, data);
        assert.equal(done, true);
    });

};
