const { geo } = require('..');

const states = require('./source/states.json');

const refresh = async () => {
    const sourceDir = __dirname + '/source';
    const outputDir = sourceDir;

    await geo.geonames.admin1CodesASCII.download({ sourceDir, outputDir });
    let admin1Codes = await geo.geonames.admin1CodesASCII.toJson({ sourceDir, outputDir });

    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    let cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });

    cities = geo.assignStateToCities({ cities, states, admin1Codes });

    await geo.geonames.countryInfo.download({ sourceDir, outputDir });
    await geo.geonames.countryInfo.toJson({ sourceDir, outputFile: outputDir + '/countries.json' });

}

refresh();
