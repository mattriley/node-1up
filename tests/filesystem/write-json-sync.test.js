module.exports = ({ test, assert, compose }) => () => {

    test('write JSON sync', () => {
        let done = false;
        const targetPath = 'foo/bar.json';
        const targetObject = { foo: 'bar' };
        const json = JSON.stringify(targetObject, null, 4);
        const overrides = {
            io: {
                fs: {
                    writeFileSync: (path, data) => {
                        assert.equal(path, targetPath);
                        assert.equal(data, json);
                        done = true;
                    }
                }
            }
        }
        const { fs } = compose({ overrides });
        fs.writeJsonSync(targetPath, targetObject);
        assert.ok(done);
    });

};
