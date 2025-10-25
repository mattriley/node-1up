const fs = require('fs');
const { geo } = require('..');
const statesOrig = require('./source/statesOrig.json');
const federalTerritoryCities = require('./source/federal-territory-cities.json');

const sourceDir = __dirname + '/source';
const outputDir = sourceDir;

const refresh = async () => {

    await geo.geonames.admin1CodesAscii.download({ sourceDir, outputDir });
    const admin1Codes = await geo.geonames.admin1CodesAscii.toJson({ sourceDir, outputDir });

    let states = geo.data.fixStates(statesOrig);
    states = geo.data.assignTimezonesToStates({ states });
    states = geo.data.assignMissingStates({ states, admin1Codes });

    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    let cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });
    cities = geo.data.fixCities(cities);
    cities = geo.data.assignStateToCities({ cities, states, admin1Codes });
    cities = geo.data.assignFederalTerritoryToCities({ cities, federalTerritoryCities });
    cities = geo.data.fixCities(cities);
    states = geo.data.fixCities(states);

    await geo.geonames.countryInfo.download({ sourceDir, outputDir });
    let countries = await geo.geonames.countryInfo.toJson({ sourceDir });
    countries = geo.data.assignTimezonesToCountries({ countries });

    fs.writeFileSync(outputDir + '/cities.json', JSON.stringify(cities, null, 4));
    fs.writeFileSync(outputDir + '/states.json', JSON.stringify(states, null, 4));
    fs.writeFileSync(outputDir + '/countries.json', JSON.stringify(countries, null, 4));

}

refresh();
