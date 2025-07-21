module.exports = ({ test, assert, compose }) => () => {

    test('remove and create a directory', async () => {
        let done = false;
        const targetPath = 'foo/bar.json';
        const overrides = {
            fs: {
                rmSync: (path, { recursive, force }) => {
                    assert.equal(path, targetPath);
                    assert.equal(recursive, true);
                    assert.equal(force, true);
                }
            },
            fsp: {
                mkdir: (path, { recursive }) => {
                    assert.equal(path, targetPath);
                    assert.equal(recursive, true);
                    done = true;
                }
            }

        };
        const { fsx } = compose({ overrides });
        await fsx.remkdir(targetPath);
        assert.ok(done);
    });

};
