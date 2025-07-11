module.exports = ({ net }) => async ({ sourceDir, sourceFile, source, outputDir, outputFile } = {}) => {

    return await net.parse({
        sourceDir,
        sourceFile,
        source,
        outputDir,
        outputFile,
        delimiter: ',',
        columns: [
            'airport_id',     // 0
            'name',           // 1
            'city',           // 2
            'country',        // 3
            'iata',           // 4
            'icao',           // 5
            'latitude',       // 6
            'longitude',      // 7
            'altitude',       // 8
            'timezone_offset',// 9
            'dst',            // 10
            'tz_database',    // 11
            'type',           // 12
            'source'          // 13
        ],
        defaultFilename: 'airports.dat',
        transform: parts => {
            const clean = s => s?.replace(/^"|"$/g, '') || null;
            return {
                name: clean(parts[1]),
                city: clean(parts[2]),
                country: clean(parts[3]),
                iata: clean(parts[4]) !== '\\N' ? clean(parts[4]) : null,
                icao: clean(parts[5]) !== '\\N' ? clean(parts[5]) : null,
                latitude: parseFloat(parts[6]),
                longitude: parseFloat(parts[7]),
                altitude: parseInt(parts[8], 10) || null,
                timezoneOffset: parseFloat(parts[9]),
                timezone: clean(parts[11]),
                type: clean(parts[12]),
                source: clean(parts[13])
            };
        }
    });

};
