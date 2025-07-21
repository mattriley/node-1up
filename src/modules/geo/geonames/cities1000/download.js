module.exports = ({ net }) => async ({ sourceDir, outputDir }) => {

    return net.download({
        url: 'https://download.geonames.org/export/dump/cities1000.zip',
        entryName: 'cities1000.txt',
        sourceDir, outputDir
    });

}
