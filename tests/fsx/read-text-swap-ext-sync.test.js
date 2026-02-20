module.exports = ({ test, assert, compose }) => () => {

    test('swaps extension and reads UTF-8 text synchronously', () => {
        const { fsx } = compose({
            overrides: {
                fs: {
                    readFileSync: (path, enc) => {
                        assert.equal(path, '/tmp/a/file.txt');
                        assert.equal(enc, 'utf8');
                        return 'hello';
                    }
                }
            }
        });

        const actual = fsx.readTextSwapExtSync('/tmp/a/file.json', 'txt');
        assert.equal(actual, 'hello');
    });

};
