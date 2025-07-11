const { geo } = require('..');

const refresh = async () => {
    const sourceDir = __dirname + '/source';
    const outputDir = sourceDir;
    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    await geo.geonames.cities1000.toJson({ sourceDir, outputDir });
}

refresh();
