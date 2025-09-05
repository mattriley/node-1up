module.exports = ({ net }) => async ({ sourceDir, outputDir }) => {

    return net.download({
        url: 'https://download.geonames.org/export/dump/admin1CodesASCII.txt',
        entryName: 'admin1CodesASCII.txt',
        sourceDir, outputDir
    });

};
