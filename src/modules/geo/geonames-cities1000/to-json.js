const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Readable } = require('stream');

// GeoNames columns for reference (not used directly in output)
const columns = [
    'geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude',
    'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code',
    'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
    'dem', 'timezone', 'modification_date'
];

module.exports = () => async ({
    sourceDir,
    sourceFile,
    source,
    outputDir,
    outputFile
} = {}) => {
    let inputStream;

    if (source) {
        inputStream = Readable.from(
            source.split(/\r?\n/).filter(line => line.trim().length > 0)
        );
    } else {
        const inputPath = sourceFile ?? path.join(sourceDir ?? '.', 'cities1000.txt');

        if (!fs.existsSync(inputPath)) {
            throw new Error(`❌ Input file not found: ${inputPath}`);
        }
        inputStream = fs.createReadStream(inputPath);
    }


    const rl = readline.createInterface({ input: inputStream });
    const cities = [];

    for await (const line of rl) {
        const parts = line.split('\t');
        if (parts.length < columns.length) continue;

        const city = {
            // geonameid: parts[0],
            name: parts[1],
            countryCode: parts[8],
            // admin1_code: parts[10],
            latitude: parseFloat(parts[4]),
            longitude: parseFloat(parts[5]),
            population: parseInt(parts[14], 10) || 0,
            timezone: parts[17]
        };

        cities.push(city);
    }

    // Determine output file path
    let finalOutputPath = null;
    if (outputFile) {
        finalOutputPath = outputFile;
    } else if (outputDir) {
        finalOutputPath = path.join(outputDir, 'cities1000.json');
    }

    if (finalOutputPath) {
        fs.writeFileSync(finalOutputPath, JSON.stringify(cities, null, 4), 'utf-8');
        console.log(`✅ Saved ${cities.length} cities to ${finalOutputPath}`);
    } else {
        console.log(`✅ Parsed ${cities.length} cities to memory`);
    }

    return cities;
};
