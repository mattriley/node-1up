module.exports = ({ test, assert, compose }) => () => {

    const targetObject = { foo: 'bar' };

    const runTest = (indent, expected) => {
        let done = false;
        const targetPath = 'foo/bar.json';
        const overrides = {
            io: {
                fs: {
                    writeFileSync: (path, data) => {
                        assert.equal(path, targetPath);
                        assert.equal(data, expected);
                        done = true;
                    }
                }
            }
        }
        const config = { indent };
        const { fs } = compose({ overrides, config });
        fs.writeJsonSync(targetPath, targetObject, indent);
        assert.ok(done);
    }

    test('write a json file with default configured indent', () => {
        const expected = JSON.stringify(targetObject, null, 4);
        runTest(undefined, expected);
    });

    test('write a json file with custom configured indent', () => {
        const expected = JSON.stringify(targetObject, null, 3);
        runTest(3, expected);
    });

    test('write a json file with custom indent', () => {
        const expected = JSON.stringify(targetObject, null, 2);
        runTest(2, expected);
    });

};
