const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);

const URL = 'https://download.geonames.org/export/dump/cities1000.txt';

module.exports = () => async ({ outputDir = './' }) => {

    const outputFile = path.join(outputDir, 'cities1000.txt');

    try {
        console.log(`📥 Downloading from ${URL}...`);

        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`❌ Failed to download: ${response.status} ${response.statusText}`);
        }

        await streamPipeline(response.body, fs.createWriteStream(outputFile));
        console.log(`✅ Downloaded to ${outputFile}`);
    } catch (err) {
        console.error('❌ Error:', err.message);
    }

}
