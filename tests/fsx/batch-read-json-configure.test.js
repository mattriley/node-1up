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

        const fileA = writeJsonFile(dir, 'a.json', { id: 1 });
        const fileB = writeJsonFile(dir, 'b.json', { id: 2 });

        const readJson = fsx.batchReadJsonConfigure();

        const actual = await readJson([fileA, fileB], {
            quiet: true,
            workers: 2,
            batchSize: 1
        });

        assert.equal(actual.length, 2);
        assert.ok(actual.some(row => row.id === 1));
        assert.ok(actual.some(row => row.id === 2));
    });

    test('flattens array values from parsed files', async () => {
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

    test('merges object and array results into single output', async () => {
        const dir = makeTempDir();

        const fileA = writeJsonFile(dir, 'object.json', { id: 1 });
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

        const file = writeJsonFile(dir, 'item.custom', { id: 1 });

        const readJson = fsx.batchReadJsonConfigure({
            parsers: {
                json: { module: null, method: 'parse' },
                custom: { module: parserModule, method: 'parse' }
            },
            parserExtensions: {
                '.json': 'json',
                '.custom': 'custom'
            }
        });

        const actual = await readJson([file], { quiet: true });

        assert.deepEqual(actual, [{
            parsedBy: 'custom',
            value: { id: 1 }
        }]);
    });

    test('selects parser by file extension', async () => {
        const dir = makeTempDir();

        const json5Module = writeModuleFile(dir, 'json5-parser.js', `
            module.exports.parse = text => {
                return Function('return (' + text + ')')();
            };
        `);

        const jsonFile = writeJsonFile(dir, 'item.json', {
            id: 1,
            format: 'json'
        });

        const json5File = writeFile(dir, 'item.json5', "{ id: 2, format: 'json5' }");

        const readJson = fsx.batchReadJsonConfigure({
            parsers: {
                json: { module: null, method: 'parse' },
                json5: { module: json5Module, method: 'parse' }
            },
            parserExtensions: {
                '.json': 'json',
                '.json5': 'json5'
            }
        });

        const actual = await readJson([jsonFile, json5File], {
            quiet: true,
            workers: 2,
            batchSize: 1
        });

        assert.equal(actual.length, 2);
        assert.ok(actual.some(r => r.id === 1));
        assert.ok(actual.some(r => r.id === 2));
    });

    test('normalises parser extension keys to lowercase', async () => {
        const dir = makeTempDir();

        const json5Module = writeModuleFile(dir, 'json5-parser.js', `
            module.exports.parse = text => {
                return Function('return (' + text + ')')();
            };
        `);

        const file = writeFile(dir, 'item.JSON5', "{ id: 2 }");

        const readJson = fsx.batchReadJsonConfigure({
            parsers: {
                json: { module: null, method: 'parse' },
                json5: { module: json5Module, method: 'parse' }
            },
            parserExtensions: {
                '.JSON5': 'json5'
            }
        });

        const actual = await readJson([file], { quiet: true });

        assert.deepEqual(actual, [{ id: 2 }]);
    });

    test('throws when no parser is configured for extension', async () => {
        const dir = makeTempDir();

        const file = writeJsonFile(dir, 'item.data', { id: 1 });

        const readJson = fsx.batchReadJsonConfigure({
            parserExtensions: {
                '.json': 'json'
            }
        });

        await assert.rejects(async () => {
            await readJson([file], { quiet: true });
        }, /No parser configured for extension/);
    });

    test('throws when parser module does not expose method', async () => {
        const dir = makeTempDir();

        const badParser = writeModuleFile(dir, 'bad-parser.js', `
            module.exports = { nope() {} };
        `);

        const file = writeJsonFile(dir, 'item.bad', { id: 1 });

        const readJson = fsx.batchReadJsonConfigure({
            parsers: {
                json: { module: null, method: 'parse' },
                bad: { module: badParser, method: 'parse' }
            },
            parserExtensions: {
                '.json': 'json',
                '.bad': 'bad'
            }
        });

        await assert.rejects(async () => {
            await readJson([file], { quiet: true });
        }, /Invalid parser export/);
    });

    test('prefixes parse errors with the file path', async () => {
        const dir = makeTempDir();
        const file = writeFile(dir, 'broken.json', '{ bad json ');

        const readJson = fsx.batchReadJsonConfigure();

        await assert.rejects(async () => {
            await readJson([file], { quiet: true });
        }, error => {
            assert.ok(error.message.includes(`[readJson:${file}]`));
            return true;
        });
    });

    test('processes multiple batches', async () => {
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
    });

    test('processes array results across row chunks', async () => {
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

        assert.equal(actual.length, 5);
    });

};
