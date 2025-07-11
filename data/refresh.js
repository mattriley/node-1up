const { geo, net } = require('..');

const states = require('./states');
const countries = require('./source/countries.json');

const refresh = async () => {
    const sourceDir = __dirname + '/source';
    const outputDir = sourceDir;

    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    let cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });
    cities = geo.assignStateToCities({ cities, states });

    await geo.openflights.airports.download({ sourceDir, outputDir });
    const airports = await geo.openflights.airports.toJson({ sourceDir, outputDir });

    await geo.assignAirportsToCities({ countries, cities, airports, outputDir });
}

refresh();
