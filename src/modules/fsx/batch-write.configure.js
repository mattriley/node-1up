const path = require('path');
const { Buffer } = require('buffer');


module.exports = $ => (config = {}) => {
    const defaults = {
        concurrencyLimit: 512,
        compare: true,               // false | true
        compareChunkSize: 64 * 1024,  // 64KB chunks for content compare
        compareMinBytes: 64 * 1024   // < this size → always overwrite
    };
    const parseOptions = $.fun.parseConfig(defaults, config);

    // Safe compare = size check first, then chunked compare
    async function shouldWrite(filename, nextBuf, chunkSize) {
        let stat;
        try {
            stat = await $.fsp.stat(filename);
        } catch (e) {
            if (e && e.code === 'ENOENT') return true; // file missing
            throw e;
        }
        if (stat.size !== nextBuf.length) return true; // size mismatch → rewrite

        const fh = await $.fsp.open(filename, 'r');
        try {
            const tmp = Buffer.allocUnsafe(Math.min(chunkSize, nextBuf.length));
            let offset = 0;
            while (offset < nextBuf.length) {
                const toRead = Math.min(tmp.length, nextBuf.length - offset);
                const { bytesRead } = await fh.read(tmp, 0, toRead, offset);
                if (bytesRead !== toRead) return true; // unexpected short read
                if (Buffer.compare(tmp.subarray(0, toRead), nextBuf.subarray(offset, offset + toRead)) !== 0) {
                    return true; // content differs
                }
                offset += toRead;
            }
            return false; // identical
        } finally {
            await fh.close();
        }
    }

    return async (instructions, onWriteCallback = () => { }, options) => {
        const { concurrencyLimit, compare, compareChunkSize, compareMinBytes } = parseOptions(options);

        const createdDirs = new Set();
        let active = 0;
        let index = 0;

        // stats (returned)
        const stats = { written: 0, skipped: 0, failed: 0 };

        const next = () => {
            if (index >= instructions.length) return null;
            const [filename, content] = instructions[index++];
            return async () => {
                try {
                    const dir = path.dirname(filename);
                    if (!createdDirs.has(dir)) {
                        await $.fsp.mkdir(dir, { recursive: true });
                        createdDirs.add(dir);
                    }

                    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);

                    let needWrite = true;
                    if (compare && buffer.length >= compareMinBytes) {
                        needWrite = await shouldWrite(filename, buffer, compareChunkSize);
                    }

                    if (needWrite) {
                        await $.fsp.writeFile(filename, buffer);
                        stats.written++;
                        onWriteCallback(filename, { success: true, skipped: false });
                    } else {
                        stats.skipped++;
                        onWriteCallback(filename, { success: true, skipped: true });
                    }
                } catch (error) {
                    stats.failed++;
                    onWriteCallback(filename, { success: false, error });
                } finally {
                    active--;
                    run();
                }
            };
        };

        const run = () => {
            while (active < concurrencyLimit) {
                const task = next();
                if (!task) break;
                active++;
                task(); // fire-and-forget within throttle
            }
        };

        return new Promise(resolve => {
            run();
            const checkDone = setInterval(() => {
                if (active === 0 && index >= instructions.length) {
                    clearInterval(checkDone);
                    resolve(stats); // <-- return stats
                }
            }, 10);
        });
    };
};
