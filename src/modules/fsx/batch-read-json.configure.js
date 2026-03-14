const os = require('node:os');
const { Worker } = require('node:worker_threads');

module.exports = $ => (config = {}) => {
    const CPU_COUNT = os.cpus().length;

    const defaults = {
        workers: Math.min(32, Math.max(4, CPU_COUNT * 2)),
        batchSize: 4000,
        rowsChunkSize: 16384,
        quiet: false
    };

    const parseOptions = $.fun.parseConfig(defaults, config);

    let logged = false;

    const logIfNeeded = quiet => {
        if (logged || quiet) {
            return;
        }

        logged = true;
        process.stderr.write('[INFO] batch-read-json: using max-throughput worker path (sync fs + parse in workers)\n');
    };

    const spawnWorker = rowsChunkSize => {
        const code = `
            const { parentPort } = require('node:worker_threads');
            const fs = require('node:fs');

            const ROWS_CHUNK = Math.max(1024, ${rowsChunkSize} | 0);

            const sendRows = rows => {
                for (let i = 0; i < rows.length; i += ROWS_CHUNK) {
                    parentPort.postMessage({
                        type: 'rows',
                        rows: rows.slice(i, i + ROWS_CHUNK)
                    });
                }
            };

            const processFiles = files => {
                const rows = [];

                for (let i = 0; i < files.length; i++) {
                    const p = files[i];

                    try {
                        const txt = fs.readFileSync(p, 'utf8');
                        const val = JSON.parse(txt);

                        if (Array.isArray(val)) {
                            for (let j = 0; j < val.length; j++) {
                                rows.push(val[j]);
                            }
                        } else {
                            rows.push(val);
                        }

                        if (rows.length >= ROWS_CHUNK) {
                            sendRows(rows);
                            rows.length = 0;
                        }
                    } catch (e) {
                        parentPort.postMessage({
                            type: 'error',
                            err: '[readJson:' + p + '] ' + (e && e.message || String(e))
                        });
                        return;
                    }
                }

                if (rows.length) {
                    sendRows(rows);
                }

                parentPort.postMessage({ type: 'done' });
            };

            parentPort.on('message', msg => {
                if (!msg || typeof msg !== 'object') {
                    return;
                }

                if (msg.type === 'files') {
                    processFiles(msg.files || []);
                }
            });
        `;

        return new Worker(code, { eval: true });
    };

    return async (files, options) => {
        if (!files || files.length === 0) {
            return [];
        }

        const {
            workers,
            batchSize,
            rowsChunkSize,
            quiet
        } = parseOptions(options);

        logIfNeeded(quiet);

        const batches = [];
        for (let i = 0; i < files.length; i += batchSize) {
            batches.push(files.slice(i, i + batchSize));
        }

        const chunks = [];

        await new Promise((resolve, reject) => {
            let nextBatch = 0;
            let alive = 0;
            let settled = false;
            let completed = 0;

            const pool = [];
            const poolSize = Math.min(workers, Math.max(1, batches.length));

            const fail = err => {
                if (settled) {
                    return;
                }

                settled = true;

                for (let i = 0; i < pool.length; i++) {
                    pool[i].terminate().catch(() => { });
                }

                reject(err);
            };

            const maybeResolve = () => {
                if (!settled && completed === batches.length && alive === 0) {
                    settled = true;
                    resolve();
                }
            };

            const assign = worker => {
                if (nextBatch >= batches.length) {
                    worker.terminate().catch(() => { });
                    return;
                }

                worker.postMessage({
                    type: 'files',
                    files: batches[nextBatch++]
                });
            };

            for (let i = 0; i < poolSize; i++) {
                const worker = spawnWorker(rowsChunkSize);
                pool.push(worker);
                alive++;

                worker.on('message', msg => {
                    if (!msg || typeof msg !== 'object' || settled) {
                        return;
                    }

                    if (msg.type === 'rows' && Array.isArray(msg.rows)) {
                        chunks.push(msg.rows);
                        return;
                    }

                    if (msg.type === 'error') {
                        fail(new Error(msg.err || 'json worker failed'));
                        return;
                    }

                    if (msg.type === 'done') {
                        completed++;

                        if (nextBatch < batches.length) {
                            assign(worker);
                            return;
                        }

                        worker.terminate().catch(() => { });
                    }
                });

                worker.on('error', err => {
                    fail(err);
                });

                worker.on('exit', code => {
                    alive--;

                    if (!settled && code !== 0 && code !== 1) {
                        fail(new Error('json worker exited ' + code));
                        return;
                    }

                    maybeResolve();
                });

                assign(worker);
            }
        });

        let total = 0;
        for (let i = 0; i < chunks.length; i++) {
            total += chunks[i].length;
        }

        const out = new Array(total);
        let offset = 0;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            for (let j = 0; j < chunk.length; j++) {
                out[offset++] = chunk[j];
            }
        }

        return out;
    };
};
