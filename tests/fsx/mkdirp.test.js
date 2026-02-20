module.exports = ({ test, assert, compose }) => () => {

    test('accepts string dirpath', async () => {
        let called = false;
        const { fsx } = compose({
            overrides: {
                fsp: {
                    mkdir: (dir, options) => {
                        called = true;
                        assert.equal(dir, '/tmp/foo');
                        assert.deepEqual(options, { recursive: true });
                    }
                }
            }
        });

        await fsx.mkdirp('/tmp/foo');
        assert.equal(called, true);
    });

    test('accepts filepath object and mkdirs dirname', async () => {
        let called = false;
        const { fsx } = compose({
            overrides: {
                fsp: {
                    mkdir: (dir, options) => {
                        called = true;
                        assert.equal(dir, '/tmp/foo');
                        assert.deepEqual(options, { recursive: true });
                    }
                }
            }
        });

        await fsx.mkdirp({ filepath: '/tmp/foo/bar.json' });
        assert.equal(called, true);
    });

    test('throws when both dirpath and filepath are provided', () => {
        const { fsx } = compose();
        assert.throws(
            () => fsx.mkdirp({ dirpath: '/tmp/a', filepath: '/tmp/a/b.txt' }),
            /exactly one/
        );
    });

};
