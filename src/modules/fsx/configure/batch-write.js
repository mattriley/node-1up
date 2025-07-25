const path = require('path');

module.exports = ({ fsp }) => (config = {}) => {

    const concurrencyLimit = config.concurrencyLimit ?? 512;

    return async (instructions, onWriteCallback) => {

        const createdDirs = new Set();
        let active = 0;
        let index = 0;

        const next = () => {
            if (index >= instructions.length) return null;
            const [filename, content] = instructions[index++];
            return async () => {
                try {
                    const dir = path.dirname(filename);
                    if (!createdDirs.has(dir)) {
                        await fsp.mkdir(dir, { recursive: true });
                        createdDirs.add(dir);
                    }

                    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
                    await fsp.writeFile(filename, buffer);
                    onWriteCallback(filename, { success: true });
                } catch (error) {
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
                task(); // don't await — fire-and-forget inside throttled loop
            }
        }

        return new Promise(resolve => {
            run();
            const checkDone = setInterval(() => {
                if (active === 0 && index >= instructions.length) {
                    clearInterval(checkDone);
                    resolve();
                }
            }, 10);
        });

    };
};
