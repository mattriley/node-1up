const os = require('os');
const path = require('path');

const normalizeFsType = t => (t || '').toLowerCase().replace(/\s+/g, '');

module.exports = ({ config, self }) => {

    const pick = (limits, fallback, fsType, target) => {
        if (limits) {
            return { fsType, ...limits, target };
        } else {
            return { ...fallback, fsType, target };
        }
    };

    // lookup by explicit FS type (no exec)
    const fromType = (fsType, target = undefined) => {
        const key = normalizeFsType(fsType);
        const plat = config.os.platformDefaults[os.platform()] || { nameMax: 255, pathMax: 4096, units: 'bytes', fsType: 'unknown' };
        const limits = config.os.fileSystemLimits[key];
        return pick(limits, plat, key, target);
    };

    // main router (default path = ".")
    const detect = async (targetPath = '.') => {
        const platform = os.platform();
        const absDir = path.resolve(targetPath);

        try {
            if (platform === 'darwin') {
                return await self.detectMacos(absDir);
            }
            if (platform === 'linux') {
                return await self.detectLinux(absDir);
            }
            if (platform === 'win32') {
                return await self.detectWindows(absDir);
            }
        } catch (_) {
            // fall through to defaults
        }

        const def = config.os.platformDefaults[platform] || { nameMax: 255, pathMax: 4096, units: 'bytes', fsType: 'unknown' };
        return { ...def, target: absDir };
    };

    detect.fromType = fromType;
    detect.macos = self.fsDetectMacOS;
    detect.linux = self.fsDetectLinux;
    detect.windows = self.fsDetectWindows;

    return detect;
};
