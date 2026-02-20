const os = require('os');

module.exports = ({ test, assert, compose }) => () => {

    test('fromType resolves known filesystem limits', () => {
        const { fsx, config } = compose();

        const actual = fsx.detectFileSystem.fromType('APFS', '/tmp/x');
        assert.equal(actual.fsType, 'apfs');
        assert.equal(actual.target, '/tmp/x');
        assert.equal(actual.nameMax, config.os.fileSystemLimits.apfs.nameMax);
    });

    test('detect delegates to platform-specific detector', async () => {
        const platform = os.platform();
        const calls = [];

        const { fsx } = compose({
            overrides: {
                fsx: {
                    detectMacos: async absDir => {
                        calls.push(['darwin', absDir]);
                        return { fsType: 'apfs', nameMax: 255, pathMax: 1024, units: 'chars', target: absDir };
                    },
                    detectLinux: async absDir => {
                        calls.push(['linux', absDir]);
                        return { fsType: 'ext4', nameMax: 255, pathMax: 4096, units: 'bytes', target: absDir };
                    },
                    detectWindows: async absDir => {
                        calls.push(['win32', absDir]);
                        return { fsType: 'ntfs', nameMax: 255, pathMax: 32767, units: 'chars', target: absDir };
                    }
                }
            }
        });

        const actual = await fsx.detectFileSystem('.');
        assert.equal(actual.target && typeof actual.target, 'string');
        assert.equal(calls.length, platform === 'darwin' || platform === 'linux' || platform === 'win32' ? 1 : 0);
    });

};
