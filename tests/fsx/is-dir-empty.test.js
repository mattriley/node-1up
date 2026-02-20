const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = ({ test, assert }) => ({ fsx }) => {

    test('returns true for empty directory', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fsx-empty-'));
        const actual = await fsx.isDirEmpty(dir);
        assert.equal(actual, true);
    });

    test('returns false for non-empty directory', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fsx-nonempty-'));
        fs.writeFileSync(path.join(dir, 'x.txt'), 'x', 'utf8');
        const actual = await fsx.isDirEmpty(dir);
        assert.equal(actual, false);
    });

};
