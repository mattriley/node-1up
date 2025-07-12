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
                country: 'Australia',
                countryCode: 'AU',
                inferred: [
                    'state'
                ],
                state: 'Victoria',
                stateCode: 'VIC'
            }

            const actual = $.geo.resolveCity(input);
            assert.deepEqual(actual, expected);
        }
    });

    test('Globally unique city', () => {
        const input = { city: 'Canberra' };

        const expected = {
            city: 'Canberra',
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'country',
                'state'
            ],
            state: 'Australian Capital Territory',
            stateCode: 'ACT'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + state', () => {
        const input = { city: 'Melbourne', state: 'VIC' };

        const expected = {
            city: 'Melbourne',
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'country'
            ],
            state: 'Victoria',
            stateCode: 'VIC'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });


    test('Perth', () => {
        const input = { city: 'Perth' };

        const expected = {
            city: 'Perth',
            country: undefined,
            countryCode: undefined,
            inferred: [],
            state: undefined,
            stateCode: undefined
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Perth, AU', () => {
        const input = { city: 'Perth', country: 'AU' };

        const expected = {
            city: 'Perth',
            country: 'Australia',
            countryCode: 'AU',
            inferred: [],
            state: undefined,
            stateCode: undefined
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + country', () => {
        const input = { city: 'Melbourne', country: 'AU' };

        const expected = {
            city: 'Melbourne',
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'state'
            ],
            state: 'Victoria',
            stateCode: 'VIC'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });


    test('Globally unique state', () => {
        const input = { state: 'ACT' };

        const expected = {
            city: undefined,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'country'
            ],
            state: 'Australian Capital Territory',
            stateCode: 'ACT'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique state + country', () => {
        const input = { state: 'Victoria', country: 'AU' };

        const expected = {
            city: undefined,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [],
            state: 'Victoria',
            stateCode: 'VIC'
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally unique country (countries should be inherently unique)', () => {
        const input = { country: 'AU' };

        const expected = {
            city: undefined,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [],
            state: undefined,
            stateCode: undefined
        }

        const actual = geo.resolveCity(input);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles', () => {
        const location = { city: 'Los Angeles' };

        const expected = {
            city: 'Los Angeles',
            country: undefined,
            countryCode: undefined,
            inferred: [],
            state: undefined,
            stateCode: undefined
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, CA', () => {
        const location = { city: 'Los Angeles', state: 'CA' };

        const expected = {
            city: 'Los Angeles',
            country: 'United States',
            countryCode: 'US',
            inferred: [
                'state',
                'country'
            ],
            state: 'California',
            stateCode: 'CA'
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });


    test('Los Angeles, CA, US', () => {
        const location = { city: 'Los Angeles', country: 'US', state: 'CA' };

        const expected = {
            city: 'Los Angeles',
            country: 'United States',
            countryCode: 'US',
            inferred: [],
            state: 'California',
            stateCode: 'CA'
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('(none), HK, CN', () => {
        const location = { country: 'CN', state: 'HK' };

        const expected = {
            city: undefined,
            country: 'China',
            countryCode: 'CN',
            inferred: [],
            state: 'Hong Kong SAR',
            stateCode: 'HK'
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('Houston, (none), US', () => {
        const location = { country: 'US', city: 'Houston' };

        const expected = {
            city: 'Houston',
            country: 'United States',
            countryCode: 'US',
            inferred: [],
            state: undefined,
            stateCode: undefined
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

};
