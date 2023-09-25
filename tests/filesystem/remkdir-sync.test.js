module.exports = ({ test, assert, compose }) => () => {

    test('remove and create a directory', () => {
        let done = false;
        const targetPath = 'foo/bar.json';
        const overrides = {
            io: {
                fs: {
                    rmSync: (path, { recursive, force }) => {
                        assert.equal(path, targetPath);
                        assert.equal(recursive, true);
                        assert.equal(force, true);
                    },
                    mkdirSync: (path, { recursive }) => {
                        assert.equal(path, targetPath);
                        assert.equal(recursive, true);
                        done = true;
                    }
                }
            }
        }
        const { fs } = compose({ overrides });
        fs.remkdirSync(targetPath);
        assert.ok(done);
    });

};
