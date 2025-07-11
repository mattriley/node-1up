const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Readable } = require('stream');

module.exports = () => async ({
    delimiter = '\t',
    columns = [],
    transform,
    defaultFilename = 'data.txt',
    source,
    sourceFile,
    sourceDir,
    outputFile,
    outputDir
} = {}) => {
    let inputStream;

    if (source) {
        inputStream = Readable.from(
            source.split(/\r?\n/).filter(line => line.trim().length > 0)
        );
    } else {
        const resolvedPath = sourceFile ?? path.join(sourceDir ?? '.', defaultFilename);
        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`❌ Input file not found: ${resolvedPath}`);
        }
        inputStream = fs.createReadStream(resolvedPath);
    }

    const rl = readline.createInterface({ input: inputStream });
    const results = [];

    for await (const line of rl) {
        const parts = line.split(delimiter);
        if (parts.length < columns.length) continue;
        const item = transform(parts);
        if (item) results.push(item);
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
