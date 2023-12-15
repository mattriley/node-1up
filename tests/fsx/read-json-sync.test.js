module.exports = ({ test, assert, compose }) => () => {

    test('read a json file', () => {
        const targetPath = 'foo/bar.json';
        const overrides = {
            fsx: {
                nodefs: {
                    readFileSync: (path, encoding) => {
                        assert.equal(path, targetPath);
                        assert.equal(encoding, 'utf8');
                        return '{ "foo": "bar" }';
                    }
                }
            }
        };
        const { fsx } = compose({ overrides });
        const actual = fsx.readJsonSync(targetPath);
        const expected = { foo: 'bar' };
        assert.deepEqual(actual, expected);
    });

};
