module.exports = ({ test, assert, compose }) => () => {

    const targetObject = { foo: 'bar' };

    const runTest = async (indent, expected) => {
        let done = false;
        const targetPath = 'foo/bar.json';
        const overrides = {
            fsp: {
                nodefs: {
                    promises: {
                        writeFile: (path, data) => {
                            assert.equal(path, targetPath);
                            assert.equal(data, expected);
                            done = true;
                        }
                    }
                }
            }
        };
        const config = { indent };
        const { fsp } = compose({ overrides, config });
        await fsp.writeJson(targetPath, targetObject, indent);
        assert.ok(done);
    };

    test('write a json file with default configured indent', async () => {
        const expected = JSON.stringify(targetObject, null, 4);
        await runTest(undefined, expected);
    });

    test('write a json file with custom configured indent', async () => {
        const expected = JSON.stringify(targetObject, null, 3);
        await runTest(3, expected);
    });

    test('write a json file with custom indent', async () => {
        const expected = JSON.stringify(targetObject, null, 2);
        await runTest(2, expected);
    });

};
