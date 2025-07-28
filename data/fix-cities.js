module.exports = cities => {

    // const northShore = cities.find(state => state.name === 'North Shore' && state.countryCode === 'NZ')
    // cities.push({ ...northShore, name: 'Auckland' });

    cities.filter(city => ['HK', 'MO'].includes(city.countryCode)).forEach(city => {
        city.stateCode = city.countryCode;
        city.countryCode = 'CN';
    });

    return cities;

};
