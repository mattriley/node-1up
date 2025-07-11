const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ZIP_URL = 'https://download.geonames.org/export/dump/cities1000.zip';

module.exports = () => async ({
    source,
    sourceFile,
    sourceDir,
    outputFile,
    outputDir
} = {}) => {
    try {
        // ✅ Use source string if provided
        if (source) {
            console.log(`⚡ Using in-memory source (${source.length} chars)`);
            return source;
        }

        // ✅ Use sourceFile or sourceDir if available
        const resolvedFile = sourceFile ?? (sourceDir ? path.join(sourceDir, 'cities1000.txt') : null);
        if (resolvedFile && fs.existsSync(resolvedFile)) {
            const fileText = fs.readFileSync(resolvedFile, 'utf-8');
            console.log(`⚡ Loaded from file: ${resolvedFile} (${fileText.length} chars)`);
            return fileText;
        }

        // 🛰️ Download if no cached file or source
        console.log(`📥 Downloading from ${ZIP_URL}...`);

        const response = await fetch(ZIP_URL);
        if (!response.ok) {
            throw new Error(`❌ Failed to download: ${response.status} ${response.statusText}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const zip = new AdmZip(buffer);

        const entry = zip.getEntry('cities1000.txt');
        if (!entry) throw new Error(`❌ cities1000.txt not found in ZIP`);

        const text = entry.getData().toString('utf-8');

        // Determine output path
        let finalOutputPath = null;
        if (outputFile) {
            finalOutputPath = outputFile;
        } else if (outputDir) {
            finalOutputPath = path.join(outputDir, 'cities1000.txt');
        }

        if (finalOutputPath) {
            fs.writeFileSync(finalOutputPath, text, 'utf-8');
            console.log(`✅ Extracted and saved to ${finalOutputPath}`);
        } else {
            console.log(`✅ Extracted to memory (${text.length} chars)`);
        }

        return text;
    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    }
};
