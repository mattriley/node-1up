const fs = require('fs');
const { geo } = require('..');
const fixStates = require('./fix-states');
const fixCities = require('./fix-cities');
let states = require('./source/statesOrig.json');
const federalTerritoryCities = require('./source/federal-territory-cities.json');

const sourceDir = __dirname + '/source';
const outputDir = sourceDir;

const refresh = async () => {

    states = fixStates(states);
    fs.writeFileSync(outputDir + '/states.json', JSON.stringify(states, null, 4));

    await geo.geonames.admin1CodesASCII.download({ sourceDir, outputDir });
    let admin1Codes = await geo.geonames.admin1CodesASCII.toJson({ sourceDir, outputDir });

    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    let cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });

    cities = fixCities(cities);
    cities = geo.assignStateToCities({ cities, states, admin1Codes });
    cities = geo.assignFederalTerritoryToCities({ cities, federalTerritoryCities });
    fs.writeFileSync(outputDir + '/cities.json', JSON.stringify(cities, null, 4));

    await geo.geonames.countryInfo.download({ sourceDir, outputDir });
    await geo.geonames.countryInfo.toJson({ sourceDir, outputFile: outputDir + '/countries.json' });

}

refresh();
