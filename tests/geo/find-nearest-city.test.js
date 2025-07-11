const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('location data must be loaded to enable geo', () => {
        const input = { latitude: -37.814, longitude: 144.96332 };

        const expected = {
            city: 'Melbourne',
            'city.iata': 'MEL',
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU',
            distanceKm: 0,
            latitude: -37.814,
            longitude: 144.96332
        };

        const actual = geo.findNearestCity(input);
        assert.deepEqual(actual, expected);
    });

};
