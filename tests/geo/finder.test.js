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

};
