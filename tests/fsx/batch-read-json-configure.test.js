module.exports = ({ test, assert }) => ({ fsx }) => {

    const path = require('node:path');
    const os = require('node:os');
    const nativeFs = require('node:fs');

    const makeTempDir = () => {
        return nativeFs.mkdtempSync(path.join(os.tmpdir(), 'batch-read-json-test-'));
    };

    const writeFile = (dir, name, value) => {
        const file = path.join(dir, name);
        nativeFs.writeFileSync(file, value);

        return file;
    };

    const writeJsonFile = (dir, name, value) => {
        return writeFile(dir, name, JSON.stringify(value));
    };

    const writeModuleFile = (dir, name, source) => {
        return writeFile(dir, name, source);
    };

    test('returns empty array when files is missing', async () => {
        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson();

        assert.deepEqual(actual, []);
    });

    test('returns empty array when files is null', async () => {
        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson(null);

        assert.deepEqual(actual, []);
    });

    test('returns empty array when files is empty', async () => {
        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([]);

        assert.deepEqual(actual, []);
    });

    test('parses a single json object file', async () => {
        const dir = makeTempDir();
        const file = writeJsonFile(dir, 'item.json', {
            id: 1,
            title: 'Alpha'
        });

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([file], {
            quiet: true
        });

        assert.deepEqual(actual, [{
            id: 1,
            title: 'Alpha'
        }]);
    });

    test('parses multiple json object files', async () => {
        const dir = makeTempDir();

        const fileA = writeJsonFile(dir, 'a.json', {
            id: 1,
            title: 'Alpha'
        });

        const fileB = writeJsonFile(dir, 'b.json', {
            id: 2,
            title: 'Beta'
        });

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([fileA, fileB], {
            quiet: true,
            workers: 2,
            batchSize: 1
        });

        assert.equal(actual.length, 2);
        assert.ok(actual.some(row => row.id === 1 && row.title === 'Alpha'));
        assert.ok(actual.some(row => row.id === 2 && row.title === 'Beta'));
    });

    test('flattens array values from parsed files into the output', async () => {
        const dir = makeTempDir();
        const file = writeJsonFile(dir, 'items.json', [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]);

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([file], {
            quiet: true,
            rowsChunkSize: 2
        });

        assert.deepEqual(actual, [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]);
    });

    test('merges object and array file results into a single output array', async () => {
        const dir = makeTempDir();

        const fileA = writeJsonFile(dir, 'object.json', {
            id: 1
        });

        const fileB = writeJsonFile(dir, 'array.json', [
            { id: 2 },
            { id: 3 }
        ]);

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([fileA, fileB], {
            quiet: true,
            workers: 2,
            batchSize: 1,
            rowsChunkSize: 1
        });

        assert.equal(actual.length, 3);
        assert.ok(actual.some(row => row.id === 1));
        assert.ok(actual.some(row => row.id === 2));
        assert.ok(actual.some(row => row.id === 3));
    });

    test('supports parser name from configured parser registry', async () => {
        const dir = makeTempDir();

        const parserModule = writeModuleFile(dir, 'custom-parser.js', `
            module.exports.parse = text => {
                return {
                    parsedBy: 'custom',
                    value: JSON.parse(text)
                };
            };
        `);

        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 1
        });

        const readJson = fsx.batchReadJsonConfigure({
            parsers: {
                json: {
                    module: null,
                    method: 'parse'
                },
                custom: {
                    module: parserModule,
                    method: 'parse'
                }
            }
        });

        const actual = await readJson([dataFile], {
            quiet: true,
            parser: 'custom'
        });

        assert.deepEqual(actual, [{
            parsedBy: 'custom',
            value: { id: 1 }
        }]);
    });

    test('supports parser object with module and method', async () => {
        const dir = makeTempDir();

        const parserModule = writeModuleFile(dir, 'parser-object.js', `
            module.exports.parse = text => {
                const value = JSON.parse(text);
                value.via = 'parser-object';
                return value;
            };
        `);

        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 7
        });

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([dataFile], {
            quiet: true,
            parser: {
                module: parserModule,
                method: 'parse'
            }
        });

        assert.deepEqual(actual, [{
            id: 7,
            via: 'parser-object'
        }]);
    });

    test('supports parser object when module exports a function directly', async () => {
        const dir = makeTempDir();

        const parserModule = writeModuleFile(dir, 'parser-fn.js', `
            module.exports = text => {
                const value = JSON.parse(text);
                value.via = 'direct-function';
                return value;
            };
        `);

        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 9
        });

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([dataFile], {
            quiet: true,
            parser: {
                module: parserModule,
                method: 'parse'
            }
        });

        assert.deepEqual(actual, [{
            id: 9,
            via: 'direct-function'
        }]);
    });

    test('supports parser function with module metadata', async () => {
        const dir = makeTempDir();

        const parserModule = writeModuleFile(dir, 'parser-meta.js', `
            module.exports.parse = text => {
                const value = JSON.parse(text);
                value.via = 'function-metadata';
                return value;
            };
        `);

        const parser = () => { };
        parser.module = parserModule;
        parser.method = 'parse';

        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 11
        });

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([dataFile], {
            quiet: true,
            parser
        });

        assert.deepEqual(actual, [{
            id: 11,
            via: 'function-metadata'
        }]);
    });

    test('throws for unknown parser name', async () => {
        const dir = makeTempDir();
        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 1
        });

        const readJson = fsx.batchReadJsonConfigure();

        await assert.rejects(async () => {
            await readJson([dataFile], {
                parser: 'missing-parser',
                quiet: true
            });
        }, /Unknown parser/);
    });

    test('throws for parser function without module metadata', async () => {
        const dir = makeTempDir();
        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 1
        });

        const readJson = fsx.batchReadJsonConfigure();

        await assert.rejects(async () => {
            await readJson([dataFile], {
                quiet: true,
                parser: () => { }
            });
        }, /Parser functions cannot be sent directly to workers/);
    });

    test('throws for invalid parser option', async () => {
        const dir = makeTempDir();
        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 1
        });

        const readJson = fsx.batchReadJsonConfigure();

        await assert.rejects(async () => {
            await readJson([dataFile], {
                quiet: true,
                parser: 123
            });
        }, /Invalid parser option/);
    });

    test('throws when parser module does not expose the requested method', async () => {
        const dir = makeTempDir();

        const parserModule = writeModuleFile(dir, 'bad-parser.js', `
            module.exports = {
                nope() {
                    return {};
                }
            };
        `);

        const dataFile = writeJsonFile(dir, 'item.json', {
            id: 1
        });

        const readJson = fsx.batchReadJsonConfigure();

        await assert.rejects(async () => {
            await readJson([dataFile], {
                quiet: true,
                parser: {
                    module: parserModule,
                    method: 'parse'
                }
            });
        }, /Invalid parser export/);
    });

    test('prefixes parse errors with the file path', async () => {
        const dir = makeTempDir();
        const file = writeFile(dir, 'broken.json', '{ bad json ');
        const readJson = fsx.batchReadJsonConfigure();

        await assert.rejects(async () => {
            await readJson([file], {
                quiet: true
            });
        }, error => {
            assert.ok(error instanceof Error);
            assert.ok(error.message.includes(`[readJson:${file}]`));

            return true;
        });
    });

    test('processes multiple batches when batchSize is smaller than file count', async () => {
        const dir = makeTempDir();

        const files = [
            writeJsonFile(dir, 'a.json', { id: 1 }),
            writeJsonFile(dir, 'b.json', { id: 2 }),
            writeJsonFile(dir, 'c.json', { id: 3 }),
            writeJsonFile(dir, 'd.json', { id: 4 })
        ];

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson(files, {
            quiet: true,
            workers: 2,
            batchSize: 1,
            rowsChunkSize: 1
        });

        assert.equal(actual.length, 4);
        assert.ok(actual.some(row => row.id === 1));
        assert.ok(actual.some(row => row.id === 2));
        assert.ok(actual.some(row => row.id === 3));
        assert.ok(actual.some(row => row.id === 4));
    });

    test('processes array results across multiple row chunks', async () => {
        const dir = makeTempDir();

        const file = writeJsonFile(dir, 'items.json', [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ]);

        const readJson = fsx.batchReadJsonConfigure();
        const actual = await readJson([file], {
            quiet: true,
            rowsChunkSize: 2
        });

        assert.deepEqual(actual, [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
        ]);
    });

};
