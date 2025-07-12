const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('Melbourne', () => {
        const input = { latitude: -37.814, longitude: 144.96332 };

        const expected = {
            city: 'Melbourne',
            'city.latitude': -37.814,
            'city.longitude': 144.96332,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso': 'AU',
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
            'city.latitude': 22.20056,
            'city.longitude': 113.54611,
            state: 'Macau SAR',
            'state.iso': 'MO',
            country: 'China',
            'country.iso': 'CN',
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
            'city.latitude': -37.87427,
            'city.longitude': 145.42592,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso': 'AU',
            distanceKm: 3.1070021746990446,
            latitude: -37.84634722222223,
            longitude: 145.42723055555555
        };

        const actual = geo.findNearestCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Emerald', () => {
        const input = { latitude: -37.84634722222223, longitude: 145.42723055555555 };

        const expected = {
            city: 'Monbulk',
            'city.latitude': -37.87427,
            'city.longitude': 145.42592,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso': 'AU',
            distanceKm: 3.1070021746990446,
            latitude: -37.84634722222223,
            longitude: 145.42723055555555
        };

        const actual = geo.findNearestCity(input);
        assert.deepEqual(actual, expected);
    });

};
