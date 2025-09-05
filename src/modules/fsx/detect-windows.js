const process = require('node:process');

// Windows detector: PowerShell Get-Volume -DriveLetter X | select FileSystem
const normalizeFsType = t => (t || '').toLowerCase().replace(/\s+/g, '');

module.exports = ({ proc, self, config }) => async absDir => {
    // derive drive letter from absDir or CWD as fallback
    const m = absDir.match(/^([A-Za-z]):\\/);
    const drive = m ? m[1] : process.cwd().slice(0, 1);

    const ps = [
        '$ErrorActionPreference=\'Stop\';',
        `$d='${drive}';`,
        '(Get-Volume -DriveLetter $d).FileSystem'
    ].join(' ');

    const out = await proc.execText(`powershell -NoProfile -Command "${ps}"`);
    const fsType = normalizeFsType(out || 'NTFS');
    const limits = config.os.fileSystemLimits[fsType];

    if (limits) {
        return { fsType, ...limits, target: absDir };
    } else {
        return { ...self.PLATFORM_DEFAULTS.win32, fsType, target: absDir };
    }
};
