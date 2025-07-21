module.exports = ({ test, assert, compose }) => () => {

    test('read a json file', async () => {
        const targetPath = 'foo/bar.json';
        const overrides = {
            fsp: {
                readFile: (path, encoding) => {
                    assert.equal(path, targetPath);
                    assert.equal(encoding, 'utf8');
                    return '{ "foo": "bar" }';
                }
            }
        };
        const { fsx } = compose({ overrides });
        const actual = await fsx.readJson(targetPath);
        const expected = { foo: 'bar' };
        assert.deepEqual(actual, expected);
    });

};
