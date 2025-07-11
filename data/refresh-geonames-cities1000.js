const { geo } = require('..');

const refresh = async () => {
    const sourceDir = __dirname + '/source';
    const outputDir = sourceDir;
    await geo.geonamesCities1000.download({ sourceDir, outputDir });
    await geo.geonamesCities1000.toJson({ sourceDir, outputDir });
}

refresh();
