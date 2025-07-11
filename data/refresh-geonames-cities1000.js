const { geo } = require('..');

const refresh = async () => {
    const outputDir = __dirname + '/source';
    await geo.geonamesCities1000.download({ outputDir });
    await geo.geonamesCities1000.toJson({ sourceDir: outputDir, outputDir });
}

refresh();
