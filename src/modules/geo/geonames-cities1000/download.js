const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ZIP_URL = 'https://download.geonames.org/export/dump/cities1000.zip';

module.exports = () => async ({ outputDir } = {}) => {
    try {
        console.log(`📥 Downloading from ${ZIP_URL}...`);

        const response = await fetch(ZIP_URL);
        if (!response.ok) {
            throw new Error(`❌ Failed to download: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));

        const entry = zip.getEntry('cities1000.txt');
        if (!entry) throw new Error(`cities1000.txt not found in ZIP`);

        const text = entry.getData().toString('utf-8');

        if (outputDir) {
            const outputFile = path.join(outputDir, 'cities1000.txt');
            fs.writeFileSync(outputFile, text, 'utf-8');
            console.log(`✅ Extracted and saved to ${outputFile}`);
        } else {
            console.log(`✅ Extracted to memory (${text.length} chars)`);
        }

        return text;
    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    }
};
