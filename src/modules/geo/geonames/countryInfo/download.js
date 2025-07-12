module.exports = ({ net }) => async ({ sourceDir, outputDir }) => {

    return await net.download({
        url: 'https://download.geonames.org/export/dump/countryInfo.txt',
        entryName: 'countryInfo.txt',
        sourceDir, outputDir
    });

}
