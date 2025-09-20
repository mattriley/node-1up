// macOS detector: uses `stat -f %T <dir>` → e.g. "apfs"
const normalizeFsType = t => (t || '').toLowerCase().replace(/\s+/g, '');

module.exports = ({ proc, self }) => async absDir => {
    const out = await proc.execText(`stat -f %T ${JSON.stringify(absDir)}`);
    const fsType = normalizeFsType(out);
    const limits = self.config.os.fileSystemLimits[fsType];

    if (limits) {
        return { fsType, ...limits, target: absDir };
    }
    return { ...self.PLATFORM_DEFAULTS.darwin, fsType, target: absDir };

};
