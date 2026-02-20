const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = ({ test, assert }) => ({ net }) => {

    test('returns in-memory source directly', async () => {
        const actual = await net.download({ source: 'hello-world' });
        assert.equal(actual, 'hello-world');
    });

    test('loads text from sourceFile when present', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'net-download-'));
        const sourceFile = path.join(dir, 'data.txt');
        fs.writeFileSync(sourceFile, 'from-file', 'utf8');

        const actual = await net.download({ sourceFile });
        assert.equal(actual, 'from-file');
    });

    test('loads text from sourceDir + defaultFilename', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'net-download-'));
        const filename = 'input.txt';
        fs.writeFileSync(path.join(dir, filename), 'from-dir', 'utf8');

        const actual = await net.download({ sourceDir: dir, defaultFilename: filename });
        assert.equal(actual, 'from-dir');
    });

};
