const fs = require('fs');
const readline = require('readline');

const INPUT_FILE = __dirname + '/source/cities1000.txt';
const OUTPUT_FILE = __dirname + '/source/cities1000.json';

// Field names from GeoNames readme
const columns = [
    'geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude',
    'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code',
    'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
    'dem', 'timezone', 'modification_date'
];

async function convertFile(inputPath, outputPath) {
    const inputStream = fs.createReadStream(inputPath);
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

    fs.writeFileSync(outputPath, JSON.stringify(cities, null, 4));
}

// Run the script
convertFile(INPUT_FILE, OUTPUT_FILE).catch(err => {
    console.error('Error:', err);
});
