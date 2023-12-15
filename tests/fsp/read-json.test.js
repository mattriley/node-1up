module.exports = ({ test, assert, compose }) => () => {

    test('read a json file', async () => {
        const targetPath = 'foo/bar.json';
        const overrides = {
            fsp: {
                nodefs: {
                    promises: {
                        readFile: (path, encoding) => {
                            assert.equal(path, targetPath);
                            assert.equal(encoding, 'utf8');
                            return '{ "foo": "bar" }';
                        }
                    }
                }
            }
        };
        const { fsp } = compose({ overrides });
        const actual = await fsp.readJson(targetPath);
        const expected = { foo: 'bar' };
        assert.deepEqual(actual, expected);
    });

};
