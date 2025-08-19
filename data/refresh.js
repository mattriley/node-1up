const fs = require('fs');
const { geo } = require('..');
let states = require('./source/statesOrig.json');
const federalTerritoryCities = require('./source/federal-territory-cities.json');

const sourceDir = __dirname + '/source';
const outputDir = sourceDir;

const refresh = async () => {

    states = geo.fixer.fixStates(states);
    states = geo.assignTimezonesToStates({ states });

    await geo.geonames.admin1CodesASCII.download({ sourceDir, outputDir });
    let admin1Codes = await geo.geonames.admin1CodesASCII.toJson({ sourceDir, outputDir });
    // columns: ['code', 'name', 'asciiName', 'geonameid'],
    // "countryCode": "TH",
    // "isoCode": "62",
    // "name": "Phuket"
    // todo: add states from admin1Codes 

    admin1Codes.forEach(admin1Code => {
        let state = states.find(state => state.name === admin1Code.name && state.countryCode === admin1Code.countryCode);
        if (state) return;
        state = {
            "name": admin1Code.name,
            "isoCode": admin1Code.isoCode,
            "countryCode": admin1Code.countryCode,
            // "latitude": "14.52891540",
            // "longitude": "100.91014210",
            // "timezone": "Asia/Bangkok"
        }
        states.push(state);
    });


    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    let cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });
    cities = geo.fixer.fixCities(cities);

    cities = geo.assignStateToCities({ cities, states, admin1Codes });
    cities = geo.assignFederalTerritoryToCities({ cities, federalTerritoryCities });
    cities = geo.fixer.fixCities(cities);
    states = geo.fixer.fixCities(states);

    await geo.geonames.countryInfo.download({ sourceDir, outputDir });
    let countries = await geo.geonames.countryInfo.toJson({ sourceDir });
    countries = geo.fixer.fixCountries(countries);
    countries = geo.assignTimezonesToCountries({ countries });

    fs.writeFileSync(outputDir + '/cities.json', JSON.stringify(cities, null, 4));
    fs.writeFileSync(outputDir + '/states.json', JSON.stringify(states, null, 4));
    fs.writeFileSync(outputDir + '/countries.json', JSON.stringify(countries, null, 4));

}

refresh();
