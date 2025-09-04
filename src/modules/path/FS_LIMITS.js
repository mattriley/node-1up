module.exports = () => {

    return {
        // macOS
        apfs: { nameMax: 255, pathMax: 1024, units: "chars", note: "macOS PATH_MAX ≈ 1024" },
        hfs: { nameMax: 255, pathMax: 1024, units: "chars" },
        hfsplus: { nameMax: 255, pathMax: 1024, units: "chars" },

        // Linux (byte-based name limits)
        "ext2/ext3": { nameMax: 255, pathMax: 4096, units: "bytes" },
        "ext2/ext3/ext4": { nameMax: 255, pathMax: 4096, units: "bytes" },
        ext4: { nameMax: 255, pathMax: 4096, units: "bytes" },
        xfs: { nameMax: 255, pathMax: 4096, units: "bytes" },
        btrfs: { nameMax: 255, pathMax: 4096, units: "bytes" },
        tmpfs: { nameMax: 255, pathMax: 4096, units: "bytes" },
        nfs: { nameMax: 255, pathMax: 4096, units: "bytes" }, // varies by server

        // Windows
        ntfs: { nameMax: 255, pathMax: 260, units: "chars" },
        refs: { nameMax: 255, pathMax: 260, units: "chars" },
        exfat: { nameMax: 255, pathMax: 260, units: "chars" },
        fat32: { nameMax: 255, pathMax: 260, units: "chars" }
    };

};
