module.exports = ({ test, assert, compose }) => () => {

    test('read JSON sync', () => {
        const targetPath = 'foo/bar.json';
        const overrides = {
            io: {
                fs: {
                    readFileSync: (path, encoding) => {
                        assert.equal(path, targetPath);
                        assert.equal(encoding, 'utf-8');
                        return '{ "foo": "bar" }';
                    }
                }
            }
        }
        const { fs } = compose({ overrides });
        const actual = fs.readJsonSync(targetPath);
        const expected = { foo: 'bar' };
        assert.deepEqual(actual, expected);
    });

};
