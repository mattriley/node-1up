const { exec } = require("child_process");
const os = require("os");
const path = require("path");

const execCmd = (cmd) =>
    new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout) => {
            if (err) return reject(err);
            resolve(String(stdout || "").trim());
        });
    });

const normalizeFsType = (t) => (t || "").toLowerCase().replace(/\s+/g, "");

/**
 * Detect filesystem limits for a given path's directory.
 * Returns { fsType, nameMax, pathMax, units, note? }
 */
module.exports = ({ config }) => async (targetPath = ".") => {
    const platform = os.platform();
    const absDir = path.resolve(targetPath);

    try {
        if (platform === "darwin") {
            const out = await execCmd(`stat -f %T ${JSON.stringify(absDir)}`);
            const fsType = normalizeFsType(out);
            const limits = config.path.fsLimits[fsType];
            return limits ? { fsType, ...limits } : { ...config.path.platformDefaults.darwin, fsType };
        }
        if (platform === "linux") {
            const out = await execCmd(`stat -f -c %T ${JSON.stringify(absDir)}`);
            const key = normalizeFsType(out);
            const limits = config.path.fsLimits[key] || config.path.fsLimits[out];
            return limits ? { fsType: key, ...limits } : { ...config.path.platformDefaults.linux, fsType: key };
        }
        if (platform === "win32") {
            const abs = path.resolve(absDir);
            const driveMatch = abs.match(/^([A-Za-z]):\\/);
            const drive = driveMatch ? driveMatch[1] : process.cwd().slice(0, 1);
            const ps = [
                "$ErrorActionPreference='Stop';",
                `$d='${drive}';`,
                "(Get-Volume -DriveLetter $d).FileSystem"
            ].join(" ");
            const out = await execCmd(`powershell -NoProfile -Command "${ps}"`);
            const fsType = normalizeFsType(out || "NTFS");
            const limits = config.path.fsLimits[fsType];
            return limits ? { fsType, ...limits } : { ...config.path.platformDefaults.win32, fsType };
        }
    } catch (_) {
        // fall through
    }

    const def = config.path.platformDefaults[os.platform()] || { nameMax: 255, pathMax: 4096, units: "bytes", fsType: "unknown" };
    return def;
};
