module.exports = ({ net }) => async ({ sourceDir, sourceFile, source, outputDir, outputFile } = {}) => {

    return net.parse({
        sourceDir,
        sourceFile,
        source,
        outputDir,
        outputFile,
        delimiter: '\t',
        columns: ['code', 'name', 'asciiName', 'geonameid'],
        defaultFilename: 'admin1CodesASCII.txt',
        transform: parts => {
            const [countryCode, admin1Code] = parts[0].split('.');
            return {
                countryCode,
                isoCode: admin1Code,
                name: parts[1]
                // asciiName: parts[2],
                // geonameid: parseInt(parts[3], 10)
            };
        }
    });

};
