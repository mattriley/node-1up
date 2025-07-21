module.exports = ({ net }) => async ({ sourceDir, sourceFile, source, outputDir, outputFile } = {}) => {

    return net.parse({
        sourceDir,
        sourceFile,
        source,
        outputDir,
        outputFile,
        delimiter: '\t',
        defaultFilename: 'countryInfo.txt',
        // Skip comment lines starting with '#'
        filter: line => !line.startsWith('#'),
        columns: [
            'iso', 'iso3', 'isoNumeric', 'fips', 'name', 'capital', 'areaSqKm',
            'population', 'continent', 'tld', 'currencyCode', 'currencyName',
            'phone', 'postalCodeFormat', 'postalCodeRegex', 'languages',
            'geonameId', 'neighbours', 'equivalentFipsCode'
        ],
        transform: parts => ({
            name: parts[4],
            isoCode: parts[0],
            // iso3: parts[1],
            // isoNumeric: parts[2],
            // fips: parts[3],
            // capital: parts[5],
            // areaSqKm: parseFloat(parts[6]) || null,
            // population: parseInt(parts[7], 10) || 0,
            // continent: parts[8],
            // tld: parts[9],
            // currencyCode: parts[10],
            // currencyName: parts[11],
            // phone: parts[12],
            // postalCodeFormat: parts[13] || null,
            // postalCodeRegex: parts[14] || null,
            // languages: parts[15]?.split(',') || [],
            // geonameId: parseInt(parts[16], 10),
            // neighbours: parts[17]?.split(',') || [],
            // equivalentFipsCode: parts[18] || null
        })
    });

};
