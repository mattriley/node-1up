const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

const URL = 'https://download.geonames.org/export/dump/cities1000.txt';

module.exports = () => async ({ outputDir } = {}) => {
    try {
        console.log(`📥 Downloading from ${URL}...`);

        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`❌ Failed to download: ${response.status} ${response.statusText}`);
        }

        if (outputDir !== undefined) {
            const outputFile = path.join(outputDir, 'cities1000.txt');
            await streamPipeline(response.body, fs.createWriteStream(outputFile));
            console.log(`✅ Downloaded to ${outputFile}`);
        } else {
            const text = await response.text();
            console.log(`✅ Downloaded to memory (${text.length} chars)`);
            return text;
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
        throw err;
    }
};
