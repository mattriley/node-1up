const os = require('node:os');
const { Worker } = require('node:worker_threads');

// --- detect host UV pool settings ---
const hadUvEnv = Object.prototype.hasOwnProperty.call(process.env, 'UV_THREADPOOL_SIZE');
const uvSize = hadUvEnv ? parseInt(process.env.UV_THREADPOOL_SIZE, 10) : NaN;

// Compute an “ideal” size: cores × 8, clamped to [8,128]
const recommendedUv = Math.min(128, Math.max(8, os.cpus().length * 8));

// Warn when unset, and also when set but below recommended
if (!hadUvEnv) {
    process.stderr.write(
        `[WARN] UV_THREADPOOL_SIZE is not set. For optimal async fs throughput, set it to ${recommendedUv}.\n` +
        `       Example: UV_THREADPOOL_SIZE=${recommendedUv} node your-app.js\n`
    );
} else if (!Number.isFinite(uvSize) || uvSize < recommendedUv) {
    process.stderr.write(
        `[WARN] UV_THREADPOOL_SIZE=${process.env.UV_THREADPOOL_SIZE} is below the recommended ${recommendedUv}.\n` +
        `       Consider setting it higher for best async fs performance.\n`
    );
}

// Healthy if at least the recommended size
const useAsyncIO = Number.isFinite(uvSize) ? uvSize >= recommendedUv : false;

// One-time path log guard
let loggedPathChoice = false;
function logPathChoice(which) {
    if (loggedPathChoice) return;
    loggedPathChoice = true;
    const shownUv = hadUvEnv ? String(process.env.UV_THREADPOOL_SIZE) : '(unset)';
    process.stderr.write(
        `[INFO] batch-read-json: using ${which}. UV_THREADPOOL_SIZE=${shownUv}, ` +
        `recommended=${recommendedUv}${useAsyncIO ? '' : ' (async-path disabled)'}\n`
    );
}

// -------- Parse worker pool (async-I/O fast path uses this) --------
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
            parentPort.on('message', (msg) => {
                try {
                    const u8 = new Uint8Array(msg.ab, msg.offset >>> 0, msg.length >>> 0);
                    const txt = dec.decode(u8);
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
            const w = this.idle.pop();
            const ab = buf.buffer;
            const offset = buf.byteOffset | 0;
            const length = buf.byteLength | 0;

            const run = (worker) => {
                worker.once('message', (msg) => {
                    this.idle.push(worker);
                    msg && msg.ok ? resolve(msg.val)
                        : reject(new Error(`JSON.parse failed: ${msg ? msg.err : 'no response'}`));
                    this.#drain();
                });
                // zero-copy transfer + slice metadata
                worker.postMessage({ ab, offset, length }, [ab]);
            };

            if (w) run(w);
            else this.queue.push({ ab, offset, length, resolve, reject });
        });
    }
    #drain() {
        while (this.idle.length && this.queue.length) {
            const w = this.idle.pop();
            const t = this.queue.shift();
            w.once('message', (msg) => {
                this.idle.push(w);
                msg && msg.ok ? t.resolve(msg.val)
                    : t.reject(new Error(`JSON.parse failed: ${msg ? msg.err : 'no response'}`));
                this.#drain();
            });
            w.postMessage({ ab: t.ab, offset: t.offset, length: t.length }, [t.ab]);
        }
    }
    async close() {
        const ws = this.idle.splice(0, this.idle.length);
        await Promise.allSettled(ws.map(w => w.terminate()));
    }
}

// -------- Minimal async pool for I/O --------
async function runPool(items, limit, worker) {
    let i = 0;
    const n = items.length;
    const k = Math.min(limit, n);
    await Promise.all(Array.from({ length: k }, async () => {
        for (; ;) {
            const idx = i++;
            if (idx >= n) return;
            // eslint-disable-next-line no-await-in-loop
            await worker(items[idx], idx);
        }
    }));
}

// -------- Fallback worker (sync read + parse inside worker thread) --------
function spawnIoParseWorker(rowsChunkSize = 8192) {
    const code = `
        const { parentPort } = require('node:worker_threads');
        const fs = require('node:fs');
        const ROWS_CHUNK = Math.max(1024, ${rowsChunkSize} | 0);
        function sendRows(rows){
            for (let i=0;i<rows.length;i+=ROWS_CHUNK){
                parentPort.postMessage({ type:'rows', rows: rows.slice(i,i+ROWS_CHUNK) });
            }
        }
        function processFiles(files){
            const rows = [];
            for (let i=0;i<files.length;i++){
                const p = files[i];
                try{
                    const txt = fs.readFileSync(p, 'utf8');
                    const val = JSON.parse(txt);
                    if (Array.isArray(val)) rows.push(...val); else rows.push(val);
                    if (rows.length >= ROWS_CHUNK){ sendRows(rows); rows.length = 0; }
                }catch(e){
                    throw new Error('[readJson:' + p + '] ' + (e && e.message || String(e)));
                }
            }
            if (rows.length) sendRows(rows);
        }
        parentPort.on('message', (msg) => {
            if (!msg || typeof msg !== 'object') return;
            if (msg.type === 'files') {
                processFiles(msg.files || []);
                parentPort.postMessage({ type:'need' });
            } else if (msg.type === 'end') {
                process.exit(0);
            }
        });
        parentPort.postMessage({ type:'need' }); // kick
    `;
    return new Worker(code, { eval: true });
}

module.exports = ({ fsp, fun }) => (config = {}) => {
    const defaults = {
        // Fast-path (async I/O) knobs:
        concurrencyIO: Math.min(192, os.cpus().length * 12),
        concurrencyCPU: Math.max(1, Math.min(os.cpus().length, 8)),
        // Fallback (sync I/O in workers) knobs:
        workersFallback: Math.min(32, Math.max(4, os.cpus().length * 2)),
        batchSizeFallback: 2000,
        rowsChunkSizeFallback: 8192,
    };
    const parseOptions = fun.parseConfig(defaults, config);

    return async (files, ...options) => {
        if (!files || files.length === 0) return [];

        const {
            concurrencyIO, concurrencyCPU,
            workersFallback, batchSizeFallback, rowsChunkSizeFallback
        } = parseOptions(options);

        const out = [];

        if (useAsyncIO) {
            logPathChoice('async I/O + parse-worker path');
            // ---- Fast path A: async I/O + parse worker pool ----
            const parsePool = new JsonParsePool(concurrencyCPU);
            const readAndParse = async (absPath) => {
                const buf = await fsp.readFile(absPath);
                const val = await parsePool.parseBuffer(buf);
                if (Array.isArray(val)) { for (let i = 0; i < val.length; i++) out.push(val[i]); }
                else out.push(val);
            };
            try {
                await runPool(files, concurrencyIO, async (p) => {
                    try { await readAndParse(p); }
                    catch (err) { err.message = `[readJson:${p}] ${err.message}`; throw err; }
                });
            } finally {
                await parsePool.close();
            }
        } else {
            logPathChoice('worker threads (sync fs) fallback path');
            // ---- Fallback path B: sync I/O + parse in workers ----
            const batches = [];
            for (let i = 0; i < files.length; i += batchSizeFallback) {
                batches.push(files.slice(i, i + batchSizeFallback));
            }
            let next = 0;
            let alive = 0;

            const spawn = () => {
                const w = spawnIoParseWorker(rowsChunkSizeFallback);
                alive++;
                w.on('message', (m) => {
                    if (!m || typeof m !== 'object') return;
                    if (m.type === 'rows' && Array.isArray(m.rows)) {
                        const rows = m.rows;
                        for (let i = 0; i < rows.length; i++) out.push(rows[i]);
                    } else if (m.type === 'need') {
                        if (next < batches.length) {
                            w.postMessage({ type: 'files', files: batches[next++] });
                        } else {
                            w.postMessage({ type: 'end' });
                        }
                    }
                });
                w.on('exit', (code) => { alive--; if (code !== 0) throw new Error(`json worker exited ${code}`); });
                w.on('error', (e) => { throw e; });
            };

            const pool = Math.min(workersFallback, Math.max(1, batches.length));
            for (let i = 0; i < pool; i++) spawn();

            await new Promise((resolve) => {
                const tick = () => { if (alive === 0) return resolve(); setTimeout(tick, 10); };
                tick();
            });
        }

        return out;
    };
};
