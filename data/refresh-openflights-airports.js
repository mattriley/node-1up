const { geo } = require('..');

const refresh = async () => {
    const sourceDir = __dirname + '/source';
    const outputDir = sourceDir;
    await geo.openflights.airports.download({ sourceDir, outputDir });
    await geo.openflights.airports.toJson({ sourceDir, outputDir });
}

refresh();
