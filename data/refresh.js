const { geo, net } = require('..');

const refresh = async () => {
    const sourceDir = __dirname + '/source';
    const outputDir = sourceDir;

    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    const cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });

    await geo.openflights.airports.download({ sourceDir, outputDir });
    const airports = await geo.openflights.airports.toJson({ sourceDir, outputDir });

    await geo.assignAirportsToCities({ cities, airports, outputDir });
}

refresh();
