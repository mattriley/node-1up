const process = require('node:process');
const os = require('node:os');
const { Worker } = require('node:worker_threads');

module.exports = $ => (config = {}) => {
    const CPU_COUNT = os.cpus().length;

    const defaults = {
        workers: Math.min(32, Math.max(4, CPU_COUNT * 2)),
        batchSize: 4000,
        rowsChunkSize: 16384,
        parser: 'json',
        parsers: {
            json: {
                module: null,
                method: 'parse'
            },
            json5: {
                module: 'json5',
                method: 'parse'
            }
        },
        quiet: false
    };

    const parseOptions = $.fun.parseConfig(defaults, config);

    let logged = false;

    const logIfNeeded = ({ quiet, parserName, parserModule }) => {
        if (logged || quiet) {
            return;
        }

        logged = true;

        const label = parserName || parserModule || 'json';

        process.stderr.write(
            '[INFO] batch-read-json: using max-throughput worker path ' +
            `(sync fs + parse in workers, parser=${label})\n`
        );
    };

    const normaliseParser = ({ parser, parsers }) => {
        if (typeof parser === 'string') {
            const spec = parsers[parser];

            if (!spec) {
                throw new Error(`Unknown parser '${parser}'`);
            }

            return {
                name: parser,
                module: 'module' in spec ? spec.module : null,
                method: spec.method || 'parse'
            };
        }

        if ($.obj.isPlain(parser)) {
            return {
                name: parser.name || null,
                module: 'module' in parser ? parser.module : null,
                method: parser.method || 'parse'
            };
        }

        if (typeof parser === 'function') {
            const parserModule = parser.module || parser.parserModule || null;
            const parserMethod = parser.method || parser.parserMethod || 'parse';
            const parserName = parser.name || null;

            if (!parserModule) {
                throw new Error(
                    'Parser functions cannot be sent directly to workers. ' +
                    'Provide parser.module/parser.method metadata, a parser name string, ' +
                    'or a parser object like { module, method }.'
                );
            }

            return {
                name: parserName,
                module: parserModule,
                method: parserMethod
            };
        }

        throw new Error('Invalid parser option');
    };

    const makeBatches = (files, batchSize) => {
        const batches = [];

        for (let i = 0; i < files.length; i += batchSize) {
            batches.push(files.slice(i, i + batchSize));
        }

        return batches;
    };

    const flattenChunks = chunks => {
        let total = 0;

        for (const chunk of chunks) {
            total += chunk.length;
        }

        const out = new Array(total);
        let offset = 0;

        for (const chunk of chunks) {
            for (const row of chunk) {
                out[offset++] = row;
            }
        }

        return out;
    };

    const createWorkerSource = ({ rowsChunkSize, parserModule, parserMethod }) => {
        return `
            const { parentPort } = require('node:worker_threads');
            const fs = require('node:fs');

            const ROWS_CHUNK = Math.max(1024, ${rowsChunkSize} | 0);
            const PARSER_MODULE = ${JSON.stringify(parserModule)};
            const PARSER_METHOD = ${JSON.stringify(parserMethod)};

            const parserExport = PARSER_MODULE ? require(PARSER_MODULE) : JSON;
            const parse = PARSER_MODULE
                ? (typeof parserExport === 'function'
                    ? parserExport
                    : parserExport[PARSER_METHOD])
                : JSON.parse;

            if (typeof parse !== 'function') {
                throw new Error(
                    'Invalid parser export for module ' +
                    String(PARSER_MODULE) +
                    ' using method ' +
                    String(PARSER_METHOD)
                );
            }

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
                    const path = files[i];

                    try {
                        const text = fs.readFileSync(path, 'utf8');
                        const value = parse(text);

                        if (Array.isArray(value)) {
                            for (let j = 0; j < value.length; j++) {
                                rows.push(value[j]);
                            }
                        } else {
                            rows.push(value);
                        }

                        if (rows.length >= ROWS_CHUNK) {
                            sendRows(rows);
                            rows.length = 0;
                        }
                    } catch (error) {
                        parentPort.postMessage({
                            type: 'error',
                            err: '[readJson:' + path + '] ' + (error && error.message || String(error))
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
    };

    const spawnWorker = ({ rowsChunkSize, parserModule, parserMethod }) => {
        const code = createWorkerSource({
            rowsChunkSize,
            parserModule,
            parserMethod
        });

        return new Worker(code, { eval: true });
    };

    const runWorkerPool = ({
        batches,
        workers,
        rowsChunkSize,
        parserModule,
        parserMethod
    }) => {
        return new Promise((resolve, reject) => {
            const chunks = [];
            const pool = [];
            const poolSize = Math.min(workers, Math.max(1, batches.length));

            let nextBatch = 0;
            let alive = 0;
            let completed = 0;
            let settled = false;

            const fail = error => {
                if (settled) {
                    return;
                }

                settled = true;

                for (const worker of pool) {
                    worker.terminate().catch(() => { });
                }

                reject(error);
            };

            const maybeResolve = () => {
                if (!settled && completed === batches.length && alive === 0) {
                    settled = true;
                    resolve(chunks);
                }
            };

            const assignBatch = worker => {
                if (nextBatch >= batches.length) {
                    worker.terminate().catch(() => { });
                    return;
                }

                worker.postMessage({
                    type: 'files',
                    files: batches[nextBatch++]
                });
            };

            const attachWorkerEvents = worker => {
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
                            assignBatch(worker);
                            return;
                        }

                        worker.terminate().catch(() => { });
                    }
                });

                worker.on('error', error => {
                    fail(error);
                });

                worker.on('exit', code => {
                    alive--;

                    if (!settled && code !== 0 && code !== 1) {
                        fail(new Error(`json worker exited ${code}`));
                        return;
                    }

                    maybeResolve();
                });
            };

            for (const _ of Array.from({ length: poolSize })) {
                const worker = spawnWorker({
                    rowsChunkSize,
                    parserModule,
                    parserMethod
                });

                pool.push(worker);
                alive++;

                attachWorkerEvents(worker);
                assignBatch(worker);
            }
        });
    };

    return async (files, options) => {
        if (!files || files.length === 0) {
            return [];
        }

        const {
            workers,
            batchSize,
            rowsChunkSize,
            parser,
            parsers,
            quiet
        } = parseOptions(options);

        const parserSpec = normaliseParser({ parser, parsers });

        logIfNeeded({
            quiet,
            parserName: parserSpec.name,
            parserModule: parserSpec.module
        });

        const batches = makeBatches(files, batchSize);
        const chunks = await runWorkerPool({
            batches,
            workers,
            rowsChunkSize,
            parserModule: parserSpec.module,
            parserMethod: parserSpec.method
        });

        return flattenChunks(chunks);
    };
};
