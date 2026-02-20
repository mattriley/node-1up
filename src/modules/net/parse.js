const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports = () => async ({
    delimiter = '\t',
    columns = [],
    transform,
    filter,
    defaultFilename = 'data.txt',
    source,
    sourceFile,
    sourceDir,
    outputFile,
    outputDir
} = {}) => {
    let lines;
    let inputStream;
    const results = [];

    if (source) {
        lines = source.split(/\r?\n/).filter(line => line.trim().length > 0);
    } else {
        const resolvedPath = sourceFile ?? path.join(sourceDir ?? '.', defaultFilename);
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`❌ Input file not found: ${resolvedPath}`);
        }
        inputStream = fs.createReadStream(resolvedPath);
    }

    const parseLine = line => {
        if (typeof filter === 'function' && !filter(line)) return;

        const parts = line.split(delimiter);
        if (parts.length < columns.length) return;

        const item = transform(parts);
        if (item) {
            results.push(item);
        }
    };

    if (lines) {
        for (const line of lines) {
            parseLine(line);
        }
    } else {
        const rl = readline.createInterface({ input: inputStream });
        for await (const line of rl) {
            parseLine(line);
        }
    }

    let finalOutputPath = null;
    if (outputFile) {
        finalOutputPath = outputFile;
    } else if (outputDir) {
        finalOutputPath = path.join(outputDir, defaultFilename.replace(/\.[^.]+$/, '.json'));
    }

    if (finalOutputPath) {
        fs.writeFileSync(finalOutputPath, JSON.stringify(results, null, 2), 'utf-8');
        console.log(`✅ Saved ${results.length} records to ${finalOutputPath}`);
    } else {
        console.log(`✅ Parsed ${results.length} records to memory`);
    }

    return results;
};
