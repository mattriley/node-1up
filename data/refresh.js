const fs = require('fs');
const { geo } = require('..');

const states = require('./source/statesOrig.json');

const sourceDir = __dirname + '/source';
const outputDir = sourceDir;

{
    states.filter(state => state.name === 'Malacca').forEach(state => {
        state.name = 'Melaka';
    });

    states.filter(state => state.name === 'Bay of Plenty Region').forEach(state => {
        state.name = 'Bay of Plenty';
    });

    states.filter(state => state.name.endsWith('Prefecture')).forEach(state => {
        states.push({
            ...state,
            name: state.name.replace('Prefecture', '').replace('Ō', 'O').trim()
        })
    });

    const outputFile = outputDir + '/states.json';
    fs.writeFileSync(outputFile, JSON.stringify(states, null, 4));
}

const refresh = async () => {

    await geo.geonames.admin1CodesASCII.download({ sourceDir, outputDir });
    let admin1Codes = await geo.geonames.admin1CodesASCII.toJson({ sourceDir, outputDir });

    await geo.geonames.cities1000.download({ sourceDir, outputDir });
    let cities = await geo.geonames.cities1000.toJson({ sourceDir, outputDir });

    cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
        city.stateCode = city.countryCode;
        city.countryCode = 'CN';
    });

    cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
        city.stateCode = city.countryCode;
        city.countryCode = 'CN';
    });

    const northShore = cities.find(state => state.name === 'North Shore' && state.countryCode === 'NZ')
    cities.push({ ...northShore, name: 'Auckland' });

    cities = geo.assignStateToCities({ cities, states, admin1Codes });
    fs.writeFileSync(outputDir + '/cities.json', JSON.stringify(cities, null, 4));

    await geo.geonames.countryInfo.download({ sourceDir, outputDir });
    await geo.geonames.countryInfo.toJson({ sourceDir, outputFile: outputDir + '/countries.json' });

}

refresh();
