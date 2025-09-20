// tests/proc/exec.test.js
module.exports = ({ test, assert }) => $ => {

    const fn = $.proc.exec;

    test('resolves on success with trimmed stdout/stderr and code=0', async () => {
        const { stdout, stderr, code, signal } = await fn('node -e "process.stdout.write(\'ok\')"');
        assert.equal(stdout, 'ok');
        assert.equal(stderr, '');
        assert.equal(code, 0);
        assert.equal(signal, null);
    });

    test('trims trailing newline from stdout', async () => {
        const { stdout } = await fn('node -e "console.log(\'ok\')"');
        assert.equal(stdout, 'ok');
    });

    test('captures stderr even when exit code is 0', async () => {
        const { stdout, stderr, code } = await fn('node -e "console.error(\'warn\')"');
        assert.equal(stdout, '');
        assert.equal(stderr, 'warn');
        assert.equal(code, 0);
    });

    test('rejects with ExecError on non-zero exit, preserving fields', async () => {
        const cmd = 'node -e "console.error(\'bad\'); process.exit(3)"';
        try {
            await fn(cmd);
            assert.fail('expected rejection');
        } catch (err) {
            assert.equal(err.name, 'ExecError');
            assert.equal(err.cmd, cmd);
            assert.equal(err.stderr, 'bad');
            assert.equal(err.stdout, '');
            assert.equal(err.code, 3);
            assert.equal(err.signal, null);
            assert.ok(err.message && typeof err.message === 'string');
        }
    });

    test('supports cwd option (runs in provided directory)', async () => {
        const fs = require('fs');
        const path = require('path');
        const os = require('os');

        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-cwd-'));

        // Resolve symlinks (macOS: /var → /private/var)
        const expected = fs.realpathSync(tmp);

        const { stdout } = await fn('node -e "process.stdout.write(process.cwd())"', { cwd: tmp });

        // Also normalize path separators/casing (Windows safety)
        const norm = p => path.normalize(p);
        assert.equal(norm(stdout), norm(expected));
    });

    test('rejects when output exceeds maxBuffer (documents behavior)', async () => {
        // Force a tiny buffer; write a few kilobytes to overflow
        const cmd = 'node -e "process.stdout.write(\'a\'.repeat(50000))"';
        try {
            await fn(cmd, { maxBuffer: 1024 }); // 1 KiB
            assert.fail('expected maxBuffer rejection');
        } catch (err) {
            // Node throws a maxBuffer error; wrapper maps to ExecError
            assert.equal(err.name, 'ExecError');
            assert.equal(err.cmd, cmd);
            // message typically mentions "maxBuffer" (implementation-dependent but stable on Node)
            assert.ok(/maxBuffer/i.test(err.message));
            // code is usually null for this case; don’t assert a specific value
            assert.equal(err.signal, null);
        }
    });

};
