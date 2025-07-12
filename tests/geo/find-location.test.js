const locationData = require('../../data/location-data');

module.exports = ({ test, assert }) => $ => {

    const { geo } = $.configure({ locationData });

    test('location data must be loaded to enable geo', () => {
        const input = { city: 'Melbourne', country: 'AU' };

        {
            const expected = {
                errors: [
                    'City and country combination cannot be uniquely identified: Melbourne, AU'
                ]
            };
            const actual = $.geo.findLocation(input);
            assert.deepEqual(actual, expected);
        }

        $ = $.configure({ locationData });

        {
            const expected = {
                city: 'Melbourne',
                state: 'Victoria',
                'state.iso': 'VIC',
                country: 'Australia',
                'country.iso': 'AU',
                unique: ['city', 'country']
            };
            const actual = $.geo.findLocation(input);
            assert.deepEqual(actual, expected);
        }
    });

    test('Globally unique city', () => {
        const input = { city: 'Canberra' };

        const expected = {
            city: 'Canberra',
            state: 'Australian Capital Territory',
            'state.iso': 'ACT',
            country: 'Australia',
            'country.iso': 'AU',
            unique: ['city']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + state', () => {
        const input = { city: 'Melbourne', state: 'VIC' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso': 'AU',
            unique: ['city', 'state']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });


    test('Perth', () => {
        const input = { city: 'Perth' };

        const expected = {
            errors: ['City cannot be uniquely identified: Perth']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });

    test('Perth, AU', () => {
        const input = { city: 'Perth', country: 'AU' };

        const expected = {
            errors: [
                'City and country combination cannot be uniquely identified: Perth, AU'
            ]
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + country', () => {
        const input = { city: 'Melbourne', country: 'AU' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso': 'AU',
            unique: ['city', 'country']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });


    test('Globally unique state', () => {
        const input = { state: 'ACT' };

        const expected = {
            city: undefined,
            state: 'Australian Capital Territory',
            'state.iso': 'ACT',
            country: 'Australia',
            'country.iso': 'AU',
            unique: ['state']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique state + country', () => {
        const input = { state: 'Victoria', country: 'AU' };

        const expected = {
            city: undefined,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso': 'AU',
            unique: ['state', 'country']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally unique country (countries should be inherently unique)', () => {
        const input = { country: 'AU' };

        const expected = {
            city: undefined,
            state: undefined,
            'state.iso': undefined,
            country: 'Australia',
            'country.iso': 'AU',
            unique: ['country']
        };

        const actual = geo.findLocation(input);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles', () => {
        const location = { city: 'Los Angeles' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            errors: [
                'City cannot be uniquely identified: Los Angeles'
            ]
        }

        const actual = geo.findLocation(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, CA', () => {
        const location = { city: 'Los Angeles', state: 'CA' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            errors: [
                'City and state combination cannot be uniquely identified: Los Angeles, CA'
            ]
        }

        const actual = geo.findLocation(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });


    test('Los Angeles, CA, US', () => {
        const location = { city: 'Los Angeles', country: 'US', state: 'CA' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            'country.iso': 'US',
            'state.iso': 'CA',
            city: 'Los Angeles',
            country: 'United States',
            state: 'California',
            // unique: ['city', 'country']
            unique: ['city', 'state', 'country']
        }

        const actual = geo.findLocation(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('(none), HK, CN', () => {
        const location = { country: 'CN', state: 'HK' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            'country.iso': 'CN',
            'state.iso': 'HK',
            city: undefined,
            country: 'China',
            state: 'Hong Kong SAR',
            unique: ['state', 'country']
        }

        const actual = geo.findLocation(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Houston, (none), US', () => {
        const location = { country: 'US', city: 'Houston' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            errors: [
                'City and country combination cannot be uniquely identified: Houston, US'
            ]
        }

        const actual = geo.findLocation(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

};
