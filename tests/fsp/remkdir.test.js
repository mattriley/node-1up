module.exports = ({ test, assert, compose }) => () => {

    test('remove and create a directory', async () => {
        let done = false;
        const targetPath = 'foo/bar.json';
        const overrides = {
            fsp: {
                nodefs: {
                    rmSync: (path, { recursive, force }) => {
                        assert.equal(path, targetPath);
                        assert.equal(recursive, true);
                        assert.equal(force, true);
                    },
                    promises: {
                        mkdir: (path, { recursive }) => {
                            assert.equal(path, targetPath);
                            assert.equal(recursive, true);
                            done = true;
                        }
                    }
                }
            }
        };
        const { fsp } = compose({ overrides });
        await fsp.remkdir(targetPath);
        assert.ok(done);
    });

};
