const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('Melbourne', () => {
        const input = { latitude: -37.814, longitude: 144.96332 };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            stateCode: 'VIC',
            country: 'Australia',
            countryCode: 'AU',
            latitude: -37.814,
            longitude: 144.96332,
            distanceKm: 0
        }

        const actual = geo.findNearestCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Macau', () => {
        const input = { latitude: 22.20056, longitude: 113.54611 };

        const expected = {
            city: 'Macau',
            state: 'Macau SAR',
            stateCode: 'MO',
            country: 'China',
            countryCode: 'CN',
            latitude: 22.20056,
            longitude: 113.54611,
            distanceKm: 0
        }

        const actual = geo.findNearestCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Emerald', () => {
        const input = { latitude: -37.84634722222223, longitude: 145.42723055555555 };

        const expected = {
            city: 'Monbulk',
            state: 'Victoria',
            stateCode: 'VIC',
            country: 'Australia',
            countryCode: 'AU',
            latitude: -37.84634722222223,
            longitude: 145.42723055555555,
            distanceKm: 3.1070021746990446
        }

        const actual = geo.findNearestCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Emerald', () => {
        const input = { latitude: -37.84634722222223, longitude: 145.42723055555555 };

        const expected = {
            city: 'Monbulk',
            state: 'Victoria',
            stateCode: 'VIC',
            country: 'Australia',
            countryCode: 'AU',
            latitude: -37.84634722222223,
            longitude: 145.42723055555555,
            distanceKm: 3.1070021746990446
        }

        const actual = geo.findNearestCity(input);
        assert.deepEqual(actual, expected);
    });

};
