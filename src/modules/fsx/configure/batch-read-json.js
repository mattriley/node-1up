const os = require('node:os');
const { Worker } = require('node:worker_threads');

// Set libuv FS pool early (only if caller didn't set it)
if (!process.env.UV_THREADPOOL_SIZE) {
    process.env.UV_THREADPOOL_SIZE = String(Math.min(128, Math.max(8, os.cpus().length * 8)));
}

// Tiny worker pool: decode + JSON.parse off-thread with zero-copy transfer
class JsonParsePool {
    constructor(size = Math.max(1, Math.min(os.cpus().length, 8))) {
        this.idle = [];
        this.queue = [];
        for (let i = 0; i < size; i++) this.idle.push(this.#spawn());
    }

    #spawn() {
        const code = `
            const { parentPort } = require('node:worker_threads');
            const { TextDecoder } = require('node:util');
            const dec = new TextDecoder('utf-8', { fatal: false });
            parentPort.on('message', (ab) => {
                try {
                    const txt = dec.decode(new Uint8Array(ab));
                    const val = JSON.parse(txt);
                    parentPort.postMessage({ ok: true, val });
                } catch (e) {
                    parentPort.postMessage({ ok: false, err: e && e.message || String(e) });
                }
            });
        `;
        return new Worker(code, { eval: true });
    }

    parseBuffer(buf) {
        return new Promise((resolve, reject) => {
            const run = (w, ab) => {
                const onMsg = (msg) => {
                    w.off('message', onMsg);
                    this.idle.push(w);
                    msg.ok ? resolve(msg.val) : reject(new Error(`JSON.parse failed: ${msg.err}`));
                    this.#drain();
                };
                w.on('message', onMsg);
                // transfer the ArrayBuffer (zero copy)
                w.postMessage(ab, [ab]);
            };
            const w = this.idle.pop();
            const ab = buf.buffer;
            if (w) run(w, ab);
            else this.queue.push({ buf, resolve, reject });
        });
    }

    #drain() {
        while (this.idle.length && this.queue.length) {
            const w = this.idle.pop();
            const t = this.queue.shift();
            const onMsg = (msg) => {
                w.off('message', onMsg);
                this.idle.push(w);
                msg.ok ? t.resolve(msg.val) : t.reject(new Error(`JSON.parse failed: ${msg.err}`));
                this.#drain();
            };
            w.on('message', onMsg);
            w.postMessage(t.buf.buffer, [t.buf.buffer]);
        }
    }

    async close() {
        const list = this.idle.splice(0, this.idle.length);
        await Promise.allSettled(list.map((w) => w.terminate()));
    }
}

// Minimal async pool for I/O
async function runPool(items, limit, worker) {
    let i = 0;
    const n = items.length;
    const k = Math.min(limit, n);
    await Promise.all(
        Array.from({ length: k }, async () => {
            for (; ;) {
                const idx = i++;
                if (idx >= n) return;
                await worker(items[idx], idx);
            }
        })
    );
}

module.exports = ({ fsp, fun }) => (config = {}) => {
    const defaults = {
        concurrencyIO: Math.min(192, os.cpus().length * 12),
        concurrencyCPU: Math.max(1, Math.min(os.cpus().length, 8)),
    };
    const parseOptions = fun.parseConfig(defaults, config); // returns fn(optionsArray)

    return async (files, ...options) => {
        if (!files || files.length === 0) return [];

        const { concurrencyIO, concurrencyCPU } = parseOptions(options);
        const ioConc = concurrencyIO;
        const cpuConc = concurrencyCPU;

        const parsePool = new JsonParsePool(cpuConc);
        const out = [];

        const readAndParse = async (p) => {
            const buf = await fsp.readFile(p);            // absolute path → Buffer
            const val = await parsePool.parseBuffer(buf); // decode+parse off-thread
            if (Array.isArray(val)) {
                for (let i = 0; i < val.length; i++) out.push(val[i]);
            } else {
                out.push(val);
            }
        };

        try {
            await runPool(files, ioConc, async (p) => {
                try {
                    await readAndParse(p);
                } catch (err) {
                    err.message = `[readJson:${p}] ${err.message}`;
                    throw err;
                }
            });
        } finally {
            await parsePool.close();
        }

        return out;
    };
};
