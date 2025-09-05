// Linux detector: uses `stat -f -c %T <dir>` → e.g. "ext4", "xfs", "btrfs"
const normalizeFsType = t => (t || '').toLowerCase().replace(/\s+/g, '');

module.exports = ({ proc, config }) => async absDir => {
    const out = await proc.execText(`stat -f -c %T ${JSON.stringify(absDir)}`);
    const key = normalizeFsType(out);
    const limits = config.os.fileSystemLimits[key] || config.os.fileSystemLimits[out];

    if (limits) {
        return { fsType: key, ...limits, target: absDir };
    } else {
        return { ...config.os.platformDefaults.linux, fsType: key, target: absDir };
    }
};
