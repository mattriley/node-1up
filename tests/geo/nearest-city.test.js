const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('Melbourne', () => {
        const input = { latitude: -37.814, longitude: 144.96332 };

        const expected = {
            location: {
                city: 'Melbourne',
                country: 'Australia',
                countryCode: 'AU',
                state: 'Victoria',
                stateCode: 'VIC',
                timezone: 'Australia/Melbourne'
            },
            latitude: -37.814,
            longitude: 144.96332,
            distanceKm: 0

        };

        const actual = geo.nearestCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Macau', () => {
        const input = { latitude: 22.20056, longitude: 113.54611 };

        const expected = {
            location: {
                city: 'Macau',
                country: 'China',
                countryCode: 'CN',
                state: 'Macau SAR',
                stateCode: 'MO',
                timezone: 'Asia/Macau'
            },
            latitude: 22.20056,
            longitude: 113.54611,
            distanceKm: 0

        };

        const actual = geo.nearestCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Emerald', () => {
        const input = { latitude: -37.84634722222223, longitude: 145.42723055555555 };

        const expected = {
            location: {
                city: 'Monbulk',
                country: 'Australia',
                countryCode: 'AU',
                state: 'Victoria',
                stateCode: 'VIC',
                timezone: 'Australia/Melbourne'
            },
            latitude: -37.84634722222223,
            longitude: 145.42723055555555,
            distanceKm: 3.1070021746990446

        };

        const actual = geo.nearestCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Emerald', () => {
        const input = { latitude: -37.84634722222223, longitude: 145.42723055555555 };

        const expected = {
            location: {
                city: 'Monbulk',
                country: 'Australia',
                countryCode: 'AU',
                state: 'Victoria',
                stateCode: 'VIC',
                timezone: 'Australia/Melbourne'
            },
            latitude: -37.84634722222223,
            longitude: 145.42723055555555,
            distanceKm: 3.1070021746990446

        };

        const actual = geo.nearestCity(input);
        assert.deepEqual(actual, expected);
    });

};
