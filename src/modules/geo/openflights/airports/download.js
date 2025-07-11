module.exports = ({ net }) => async ({ sourceDir, outputDir }) => {

    return await net.download({
        url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat',
        entryName: 'airports.dat',
        sourceDir, outputDir
    });

}
