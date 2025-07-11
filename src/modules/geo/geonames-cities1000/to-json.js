const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Readable } = require('stream');

// GeoNames columns
const columns = [
    'geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude',
    'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code',
    'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
    'dem', 'timezone', 'modification_date'
];

module.exports = () => async ({ sourceDir, sourceFile, source, outputPath } = {}) => {
    let inputStream;

    if (source) {
        // Source is a string of the full file content
        inputStream = Readable.from(source.split('\n'));
    } else {
        // Resolve sourceFile or sourceDir
        const inputPath = sourceFile ?? path.join(sourceDir ?? '.', 'cities1000.txt');

        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }

        inputStream = fs.createReadStream(inputPath);
    }

    const rl = readline.createInterface({ input: inputStream });
    const cities = [];

    for await (const line of rl) {
        const parts = line.split('\t');
        if (parts.length < columns.length) continue;

        const city = {
            geonameid: parts[0],
            name: parts[1],
            country_code: parts[8],
            admin1_code: parts[10],
            latitude: parseFloat(parts[4]),
            longitude: parseFloat(parts[5]),
            population: parseInt(parts[14], 10) || 0,
            timezone: parts[17]
        };

        cities.push(city);
    }

    if (outputPath) {
        fs.writeFileSync(outputPath, JSON.stringify(cities, null, 4));
        console.log(`✅ Saved ${cities.length} cities to ${outputPath}`);
    }

    return cities;
};
