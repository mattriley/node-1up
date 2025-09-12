// tests/path/validate-path.test.js
//
// Uses compose({ overrides }) and reads config from compose, per your pattern.
//

module.exports = ({ test, assert, compose }) => () => {

    const makeSUT = ({ platform = 'darwin', detectFS } = {}) => {
        const overrides = {
            os: { platform: () => platform },
            fsx: {
                // Auto-detect fallback when not using assumeFs/assumeLimits
                detectFileSystem: async () =>
                    detectFS ?? { fsType: 'apfs', nameMax: 255, pathMax: 1024, units: 'chars' }
            }
        };
        const { path: pathNS, config } = compose({ overrides });
        return { validate: pathNS.validatePath, config };
    };

    // --------------------------
    // Basic input validation
    // --------------------------
    test('rejects empty string', async () => {
        const { validate } = makeSUT({});
        const out = await validate('');
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'EMPTY_STRING');
    });

    test('rejects null byte', async () => {
        const { validate } = makeSUT({});
        const out = await validate('a\0b');
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'NULL_BYTE');
    });

    // --------------------------
    // TOTAL_TOO_LONG (chars)
    // --------------------------
    test('TOTAL_TOO_LONG when absolute path exceeds assumed pathMax (chars)', async () => {
        const { validate } = makeSUT({});
        // Use assumeLimits with very small pathMax so absolute path surely exceeds it.
        const out = await validate('foo/bar', {
            assumeLimits: { nameMax: 255, pathMax: 5, units: 'chars', fsType: 'testfs' }
        });
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'TOTAL_TOO_LONG');
        assert.strictEqual(out.fs.fsType, 'testfs');
    });

    // --------------------------
    // SEGMENT_TOO_LONG (chars)
    // --------------------------
    test('SEGMENT_TOO_LONG when a segment exceeds nameMax (chars)', async () => {
        const { validate } = makeSUT({ platform: 'linux' });
        const out = await validate('aaaa/b', {
            assumeLimits: { nameMax: 3, pathMax: 9999, units: 'chars', fsType: 'custom' }
        });
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'SEGMENT_TOO_LONG');
        assert.ok(/"aaaa"/.test(out.reason));
        assert.strictEqual(out.fs.fsType, 'custom');
    });

    // --------------------------
    // Auto-detect path (fsx.detectFileSystem)
    // --------------------------
    test('uses fsx.detectFileSystem when no assumeFs / assumeLimits', async () => {
        const { validate } = makeSUT({
            platform: 'darwin',
            detectFS: { fsType: 'detectedfs', nameMax: 10, pathMax: 9999, units: 'chars' }
        });
        // Single long segment "helloworld" length 10 fits; adding one more char fails
        const ok = await validate('helloworld');
        assert.strictEqual(ok.valid, true);
        assert.strictEqual(ok.fs.fsType, 'detectedfs');

        const bad = await validate('helloworldX');
        assert.strictEqual(bad.valid, false);
        assert.strictEqual(bad.code, 'SEGMENT_TOO_LONG');
        assert.strictEqual(bad.fs.fsType, 'detectedfs');
    });

    // --------------------------
    // assumeFs lookup (known key)
    // --------------------------
    test('assumeFs: known FS key (apfs) → uses preset and normalizes key', async () => {
        const { validate, config } = makeSUT({ platform: 'linux' });
        const out = await validate('a/b', { assumeFs: 'APFS' });
        assert.strictEqual(out.valid, true);
        assert.strictEqual(out.fs.fsType, 'apfs'); // normalized
        assert.strictEqual(out.fs.nameMax, config.os.fileSystemLimits.apfs.nameMax);
    });

    // --------------------------
    // assumeFs fallback (unknown key → platform default, keep label)
    // --------------------------
    test('assumeFs: unknown key → platform default limits but fsType is label', async () => {
        const { validate, config } = makeSUT({ platform: 'darwin' });
        const out = await validate('ok', { assumeFs: 'Weird FS' });
        assert.strictEqual(out.valid, true);
        assert.strictEqual(out.fs.fsType, 'weirdfs'); // normalized label
        // Limits should be platform default for darwin
        assert.strictEqual(out.fs.pathMax, config.os.platformDefaults.darwin.pathMax);
    });

    // --------------------------
    // Windows-only rules (invalid chars & reserved device names)
    // --------------------------
    test('win32: INVALID_CHAR on forbidden characters', async () => {
        const { validate } = makeSUT({ platform: 'win32' });
        const out = await validate('bad<name', { assumeFs: 'ntfs' });
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'INVALID_CHAR');
    });

    test('win32: RESERVED_NAME on device names (e.g., CON.txt)', async () => {
        const { validate } = makeSUT({ platform: 'win32' });
        const out = await validate('CON.txt', { assumeFs: 'ntfs' });
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'RESERVED_NAME');
    });

    // --------------------------
    // Windows long paths relaxation for validator
    // --------------------------
    test('win32: longPaths=true relaxes total length limit (avoid ":" invalid-char)', async () => {
        const { validate } = makeSUT({ platform: 'win32' });

        // Tiny pathMax ensures absolute path is too long unless longPaths is true
        const opts = { assumeLimits: { nameMax: 255, pathMax: 5, units: 'chars', fsType: 'ntfs' } };

        const tooLong = await validate('a\\b', opts);
        assert.strictEqual(tooLong.valid, false);
        assert.strictEqual(tooLong.code, 'TOTAL_TOO_LONG');

        const ok = await validate('a\\b', { ...opts, longPaths: true });
        assert.strictEqual(ok.valid, true);
        assert.strictEqual(ok.fs.fsType, 'ntfs');
    });

    // --------------------------
    // Mixed separators (win32 splitting)
    // --------------------------
    test('win32: handles both \\\\ and / as separators for segment limits', async () => {
        const { validate } = makeSUT({ platform: 'win32' });
        const out = await validate('aaaa/ok', {
            assumeLimits: { nameMax: 3, pathMax: 9999, units: 'chars', fsType: 'ntfs' }
        });
        assert.strictEqual(out.valid, false);
        assert.strictEqual(out.code, 'SEGMENT_TOO_LONG');
    });

    // --------------------------
    // Happy path (POSIX): valid path within limits
    // --------------------------
    test('posix: valid path within limits', async () => {
        const { validate } = makeSUT({ platform: 'linux' });
        const out = await validate('/home/user/project/src', {
            assumeLimits: { nameMax: 255, pathMax: 4096, units: 'chars', fsType: 'ext4' }
        });
        assert.strictEqual(out.valid, true);
        assert.strictEqual(out.fs.fsType, 'ext4');
    });

};
