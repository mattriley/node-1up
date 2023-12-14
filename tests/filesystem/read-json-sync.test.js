module.exports = ({ test, assert, compose }) => () => {

    test('read a json file', () => {
        const targetPath = 'foo/bar.json';
        const overrides = {
            fs: {
                nodefs: {
                    readFileSync: (path, encoding) => {
                        assert.equal(path, targetPath);
                        assert.equal(encoding, 'utf8');
                        return '{ "foo": "bar" }';
                    }
                }
            }
        };
        const { fs } = compose({ overrides });
        const actual = fs.readJsonSync(targetPath);
        const expected = { foo: 'bar' };
        assert.deepEqual(actual, expected);
    });

};
