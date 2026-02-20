module.exports = ({ test, assert, compose }) => () => {

    test('reads directory entries and parses json files by name', async () => {
        const dirpath = '/tmp/in';
        const { fsx } = compose({
            overrides: {
                fsp: {
                    readdir: path => {
                        assert.equal(path, dirpath);
                        return ['one.json', 'two.txt'];
                    },
                    readFile: path => {
                        assert.equal(path, '/tmp/in/two.txt');
                        return 'raw-text';
                    }
                },
                fsx: {
                    readJson: path => {
                        assert.equal(path, '/tmp/in/one.json');
                        return { a: 1 };
                    }
                }
            }
        });

        const actual = await fsx.readJsonDir(dirpath);
        const expected = { one: { a: 1 }, two: 'raw-text' };
        assert.deepEqual(actual, expected);
    });

};
