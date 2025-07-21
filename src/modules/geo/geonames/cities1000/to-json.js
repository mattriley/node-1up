module.exports = ({ net }) => async ({ sourceDir, sourceFile, source, outputDir, outputFile } = {}) => {

    return net.parse({
        sourceDir, sourceFile, source, outputDir, outputFile,
        delimiter: '\t',
        columns: [
            'geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude',
            'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code',
            'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
            'dem', 'timezone', 'modification_date'
        ],
        defaultFilename: 'cities1000.txt',
        transform: parts => ({
            name: parts[1],
            stateCode: parts[10],
            countryCode: parts[8],
            latitude: parseFloat(parts[4]),
            longitude: parseFloat(parts[5]),
            // population: parseInt(parts[14], 10) || 0,
            timezone: parts[17]
        })
    });

};
