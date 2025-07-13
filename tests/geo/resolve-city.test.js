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
                complete: true,
                country: 'Australia',
                countryCode: 'AU',
                inferred: [
                    'state'
                ],
                source: {
                    city: 'input',
                    country: 'input',
                    state: 'inferred'
                },
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
            complete: true,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'country',
                'state'
            ],
            source: {
                city: 'input',
                country: 'inferred',
                state: 'inferred'
            },
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
            complete: true,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'country'
            ],
            source: {
                city: 'input',
                country: 'inferred',
                state: 'input'
            },
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
            complete: false,
            country: undefined,
            countryCode: undefined,
            errors: [
                'Ambiguous city: Perth (5 matches across all countries)',
                'Ambiguous city: Perth (5 matches across all countries)'
            ],
            inferred: [],
            source: {},
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
            complete: false,
            country: 'Australia',
            countryCode: 'AU',
            errors: [
                'Ambiguous city: Perth (2 matches in AU)'
            ],
            inferred: [],
            source: {
                country: 'input'
            },
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
            complete: true,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'state'
            ],
            source: {
                city: 'input',
                country: 'input',
                state: 'inferred'
            },
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
            complete: false,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [
                'country'
            ],
            source: {
                country: 'inferred',
                state: 'input'
            },
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
            complete: false,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [],
            source: {
                country: 'input',
                state: 'input'
            },
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
            complete: false,
            country: 'Australia',
            countryCode: 'AU',
            inferred: [],
            source: {
                country: 'input'
            },
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
            complete: false,
            country: undefined,
            countryCode: undefined,
            errors: [
                'Ambiguous city: Los Angeles (4 matches across all countries)',
                'Ambiguous city: Los Angeles (4 matches across all countries)'
            ],
            inferred: [],
            source: {},
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
            complete: true,
            country: 'United States',
            countryCode: 'US',
            inferred: [
                'country'
            ],
            source: {
                city: 'input',
                country: 'inferred',
                state: 'input'
            },
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
            complete: true,
            country: 'United States',
            countryCode: 'US',
            inferred: [],
            source: {
                city: 'input',
                country: 'input',
                state: 'input'
            },
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
            complete: false,
            country: 'China',
            countryCode: 'CN',
            inferred: [],
            source: {
                country: 'input',
                state: 'input'
            },
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
            complete: false,
            country: 'United States',
            countryCode: 'US',
            errors: [
                'Ambiguous city: Houston (5 matches in US)'
            ],
            inferred: [],
            source: {
                country: 'input'
            },
            state: undefined,
            stateCode: undefined
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

};
