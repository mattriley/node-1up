const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('Sentosa', () => {
        const expected = {
            countryCode: 'SG',
            latitude: 1.24969,
            longitude: 103.83119,
            name: 'Sentosa',
            population: 1940,
            timezone: 'Asia/Singapore'
        };
        const actual = geo.finder.findCity('Sentosa', null, 'SG');
        assert.deepEqual(actual, expected);
    });

    test('supplementary misspelling lookup resolves city, state, and country fallbacks', () => {
        const city = geo.finder.findCity('Canbera', null, 'AU');
        const state = geo.finder.findState('Califronia', 'Untied States');
        const country = geo.finder.findCountry('Untied States');

        assert.equal(city.name, 'Canberra');
        assert.equal(state.name, 'California');
        assert.equal(state.isoCode, 'CA');
        assert.equal(country.name, 'United States');
        assert.equal(country.isoCode, 'US');
    });

};
