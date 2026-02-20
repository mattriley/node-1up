module.exports = ({ test, assert, compose }) => () => {

    test('removes and recreates directory with recursive option', async () => {
        const dirpath = '/tmp/some-dir';
        let mkdirCalled = false;

        const { fsx } = compose({
            overrides: {
                fs: {
                    rmSync: (path, opts) => {
                        assert.equal(path, dirpath);
                        assert.deepEqual(opts, { recursive: true, force: true });
                    }
                },
                fsp: {
                    mkdir: (path, opts) => {
                        mkdirCalled = true;
                        assert.equal(path, dirpath);
                        assert.deepEqual(opts, { recursive: true });
                    }
                }
            }
        });

        await fsx.remkdir(dirpath);
        assert.equal(mkdirCalled, true);
    });

};
