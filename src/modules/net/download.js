const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const Buffer = require('buffer');

/**
 * Utility: detects whether a file or buffer is a ZIP archive (based on magic number).
 */
function isZipBuffer(buffer) {
    return buffer.slice(0, 4).toString() === 'PK\u0003\u0004';
}

module.exports = () => async ({
    url,
    entryName,          // name of file inside zip if needed
    defaultFilename = null,
    source,
    sourceFile,
    sourceDir,
    outputFile,
    outputDir
} = {}) => {
    try {
        const filename = defaultFilename || entryName;
        const resolvedFile =
            sourceFile ?? (sourceDir ? path.join(sourceDir, filename) : null);

        // ✅ 1. In-memory source (string)
        if (source) {
            console.log(`⚡ Using in-memory source (${source.length} chars)`);
            return source;
        }

        // ✅ 2. Local file (could be text or zip)
        if (resolvedFile && fs.existsSync(resolvedFile)) {
            const buffer = fs.readFileSync(resolvedFile);
            if (isZipBuffer(buffer)) {
                console.log(`🗜️ Unzipping local file: ${resolvedFile}`);
                const zip = new AdmZip(buffer);
                const entry = zip.getEntry(entryName);
                if (!entry) throw new Error(`❌ ${entryName} not found in ZIP`);
                const text = entry.getData().toString('utf-8');
                return text;
            }
            const text = buffer.toString('utf-8');
            console.log(`📄 Loaded local text file: ${resolvedFile}`);
            return text;

        }

        // ✅ 3. Download from remote
        console.log(`📥 Downloading from ${url}...`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`❌ Failed to download: ${response.status} ${response.statusText}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        let text;
        if (isZipBuffer(buffer)) {
            const zip = new AdmZip(buffer);
            const entry = zip.getEntry(entryName);
            if (!entry) throw new Error(`❌ ${entryName} not found in ZIP`);
            text = entry.getData().toString('utf-8');
            console.log(`✅ Downloaded and extracted ${entryName} from zip`);
        } else {
            text = buffer.toString('utf-8');
            console.log('✅ Downloaded text file');
        }

        // ✅ 4. Write to disk if requested
        let finalOutputPath = null;
        if (outputFile) {
            finalOutputPath = outputFile;
        } else if (outputDir) {
            finalOutputPath = path.join(outputDir, filename);
        }

        if (finalOutputPath) {
            fs.writeFileSync(finalOutputPath, text, 'utf-8');
            console.log(`💾 Saved to ${finalOutputPath}`);
        }

        return text;
    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    }
};
