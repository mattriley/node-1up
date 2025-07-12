const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('location data must be loaded to enable geo', () => {
        const input = { city: 'Melbourne', country: 'AU' };
        let error;

        try {
            $.geo.resolveCity(input);
        } catch (err) {
            error = err;
        }

        assert.equal(error.message, 'Country not found: AU');

        $ = $.configure({ locationData });

        {
            const expected = {
                city: 'Melbourne',
                state: 'Victoria',
                stateCode: 'VIC',
                country: 'Australia',
                countryCode: 'AU'
            };

            const actual = $.geo.resolveCity(input);
            assert.deepEqual(actual, expected);
        }
    });

    test('Globally unique city', () => {
        const input = { city: 'Canberra' };

        const expected = {
            city: 'Canberra',
            state: 'Australian Capital Territory',
            stateCode: 'ACT',
            country: 'Australia',
            countryCode: 'AU'
        };

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + state', () => {
        const input = { city: 'Melbourne', state: 'VIC' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            stateCode: 'VIC',
            country: 'Australia',
            countryCode: 'AU'
        };

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });


    test('Perth', () => {
        const input = { city: 'Perth' };

        const expected = {
            city: 'Perth',
            state: undefined,
            stateCode: undefined,
            country: undefined,
            countryCode: undefined,
        };

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Perth, AU', () => {
        const input = { city: 'Perth', country: 'AU' };

        const expected = {
            city: 'Perth',
            state: undefined,
            stateCode: undefined,
            country: 'Australia',
            countryCode: 'AU'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + country', () => {
        const input = { city: 'Melbourne', country: 'AU' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            stateCode: 'VIC',
            country: 'Australia',
            countryCode: 'AU'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });


    test('Globally unique state', () => {
        const input = { state: 'ACT' };

        const expected = {
            city: undefined,
            state: 'Australian Capital Territory',
            stateCode: 'ACT',
            country: 'Australia',
            countryCode: 'AU'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique state + country', () => {
        const input = { state: 'Victoria', country: 'AU' };

        const expected = {
            city: undefined,
            state: 'Victoria',
            stateCode: 'VIC',
            country: 'Australia',
            countryCode: 'AU'
        };

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally unique country (countries should be inherently unique)', () => {
        const input = { country: 'AU' };

        const expected = {
            city: undefined,
            state: undefined,
            stateCode: undefined,
            country: 'Australia',
            countryCode: 'AU'
        };

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles', () => {
        const location = { city: 'Los Angeles' };

        const expected = {
            city: 'Los Angeles',
            state: undefined,
            stateCode: undefined,
            country: undefined,
            countryCode: undefined
        };

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, CA', () => {
        const location = { city: 'Los Angeles', state: 'CA' };

        const expected = {
            city: 'Los Angeles',
            state: 'California',
            stateCode: 'CA',
            country: 'United States',
            countryCode: 'US',
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });


    test('Los Angeles, CA, US', () => {
        const location = { city: 'Los Angeles', country: 'US', state: 'CA' };

        const expected = {
            city: 'Los Angeles',
            state: 'California',
            stateCode: 'CA',
            country: 'United States',
            countryCode: 'US'
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('(none), HK, CN', () => {
        const location = { country: 'CN', state: 'HK' };

        const expected = {
            city: undefined,
            state: 'Hong Kong SAR',
            stateCode: 'HK',
            country: 'China',
            countryCode: 'CN'
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('Houston, (none), US', () => {
        const location = { country: 'US', city: 'Houston' };

        const expected = {
            city: 'Houston',
            state: undefined,
            stateCode: undefined,
            country: 'United States',
            countryCode: 'US',
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

};
