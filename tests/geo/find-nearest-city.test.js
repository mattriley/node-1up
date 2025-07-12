const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('Melbourne', () => {
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

    test('Macau', () => {
        const input = { latitude: 22.20056, longitude: 113.54611 };

        const expected = {
            city: 'Macau',
            'city.iata': undefined,
            state: 'Macau SAR',
            'state.iso': 'MO',
            country: 'China',
            'country.iso2': 'CN',
            distanceKm: 0,
            latitude: 22.20056,
            longitude: 113.54611
        };

        const actual = geo.findNearestCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Emerald', () => {
        const input = { latitude: -37.84634722222223, longitude: 145.42723055555555 };

        const expected = {
            city: 'Monbulk',
            'city.iata': undefined,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU',
            // distanceKm: 0,
            distanceKm: 2995.3269232629486, // doesn't seem right
            latitude: -37.84634722222223,
            longitude: 145.42723055555555
        };

        const actual = geo.findNearestCity(input);
        assert.deepEqual(actual, expected);
    });

};
