module.exports = ({ test, assert, compose }) => () => {

    test('creates target parent dir then renames file', async () => {
        const source = '/tmp/a/input.txt';
        const target = '/tmp/b/output.txt';
        const calls = [];

        const { fsx } = compose({
            overrides: {
                fsx: {
                    mkdirp: async dir => {
                        calls.push(['mkdirp', dir]);
                    }
                },
                fsp: {
                    rename: async (from, to) => {
                        calls.push(['rename', from, to]);
                    }
                }
            }
        });

        await fsx.rename(source, target);

        assert.deepEqual(calls, [
            ['mkdirp', '/tmp/b'],
            ['rename', source, target]
        ]);
    });

};
