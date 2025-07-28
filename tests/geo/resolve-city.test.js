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
                csc: {
                    city: 'Melbourne',
                    country: 'Australia',
                    countryCode: 'AU',
                    state: 'Victoria',
                    stateCode: 'VIC',
                    timezone: 'Australia/Melbourne'
                },
                city: { name: 'Melbourne', code: null, source: 'input' },
                state: { name: 'Victoria', code: 'VIC', source: 'inferred' },
                country: { name: 'Australia', code: 'AU', source: 'input' },
                complete: true
            }

            const actual = $.geo.resolveCity(input);

            assert.deepEqual(actual, expected);
        }
    });

    test('Globally unique city', () => {
        const input = { city: 'Canberra' };

        const expected = {
            csc: {
                city: 'Canberra',
                country: 'Australia',
                countryCode: 'AU',
                state: 'Australian Capital Territory',
                stateCode: 'ACT',
                timezone: 'Australia/Sydney'
            },
            city: { name: 'Canberra', code: null, source: 'input' },
            state: {
                name: 'Australian Capital Territory',
                code: 'ACT',
                source: 'inferred'
            },
            country: { name: 'Australia', code: 'AU', source: 'inferred' },
            complete: true
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + state', () => {
        const input = { city: 'Melbourne', state: 'VIC' };

        const expected = {
            csc: {
                city: 'Melbourne',
                country: 'Australia',
                countryCode: 'AU',
                state: 'Victoria',
                stateCode: 'VIC',
                timezone: 'Australia/Melbourne'
            },
            city: { name: 'Melbourne', code: null, source: 'input' },
            state: { name: 'Victoria', code: 'VIC', source: 'input' },
            country: { name: 'Australia', code: 'AU', source: 'inferred' },
            complete: true
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });


    test('Perth', () => {
        const input = { city: 'Perth' };

        const expected = {
            csc: {
                city: 'Perth',
                country: null,
                countryCode: null,
                state: null,
                stateCode: null,
                timezone: null
            },
            city: {
                name: 'Perth',
                code: null,
                source: 'input',
                errors: [
                    {
                        code: 'ambiguous',
                        message: 'Ambiguous: Perth (5 matches globally)'
                    },
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'State could not be inferred from city'
                    }
                ]
            },
            country: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'No country could be inferred from input'
                    }
                ]
            },
            complete: false
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Perth, AU', () => {
        const input = { city: 'Perth', country: 'AU' };

        const expected = {
            csc: {
                city: 'Perth',
                country: 'Australia',
                countryCode: 'AU',
                state: null,
                stateCode: null,
                timezone: null
            },
            city: {
                name: 'Perth',
                code: null,
                source: 'input',
                errors: [
                    {
                        code: 'ambiguous',
                        message: 'Ambiguous: Perth (2 matches in AU)'
                    },
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'State could not be inferred from city'
                    }
                ]
            },
            country: { name: 'Australia', code: 'AU', source: 'input' },
            complete: false
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + country', () => {
        const input = { city: 'Melbourne', country: 'AU' };

        const expected = {
            csc: {
                city: 'Melbourne',
                country: 'Australia',
                countryCode: 'AU',
                state: 'Victoria',
                stateCode: 'VIC',
                timezone: 'Australia/Melbourne'
            },
            city: { name: 'Melbourne', code: null, source: 'input' },
            state: { name: 'Victoria', code: 'VIC', source: 'inferred' },
            country: { name: 'Australia', code: 'AU', source: 'input' },
            complete: true
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });


    test('Globally unique state', () => {
        const input = { state: 'ACT' };

        const expected = {
            csc: {
                city: null,
                country: 'Australia',
                countryCode: 'AU',
                state: 'Australian Capital Territory',
                stateCode: 'ACT',
                timezone: null
            },
            city: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: {
                name: 'Australian Capital Territory',
                code: 'ACT',
                source: 'input'
            },
            country: { name: 'Australia', code: 'AU', source: 'inferred' },
            complete: false
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique state + country', () => {
        const input = { state: 'Victoria', country: 'AU' };

        const expected = {
            csc: {
                city: null,
                country: 'Australia',
                countryCode: 'AU',
                state: 'Victoria',
                stateCode: 'VIC',
                timezone: null
            },
            city: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: { name: 'Victoria', code: 'VIC', source: 'input' },
            country: { name: 'Australia', code: 'AU', source: 'input' },
            complete: false
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Globally unique country (countries should be inherently unique)', () => {
        const input = { country: 'AU' };

        const expected = {
            csc: {
                city: null,
                country: 'Australia',
                countryCode: 'AU',
                state: null,
                stateCode: null,
                timezone: null
            },
            city: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'State could not be inferred (no city provided)'
                    }
                ]
            },
            country: { name: 'Australia', code: 'AU', source: 'input' },
            complete: false
        }

        const actual = geo.resolveCity(input);

        assert.deepEqual(actual, expected);
    });

    test('Los Angeles', () => {
        const location = { city: 'Los Angeles' };

        const expected = {
            csc: {
                city: 'Los Angeles',
                country: null,
                countryCode: null,
                state: null,
                stateCode: null,
                timezone: null
            },
            city: {
                name: 'Los Angeles',
                code: null,
                source: 'input',
                errors: [
                    {
                        code: 'ambiguous',
                        message: 'Ambiguous: Los Angeles (4 matches globally)'
                    },
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'State could not be inferred from city'
                    }
                ]
            },
            country: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'No country could be inferred from input'
                    }
                ]
            },
            complete: false
        }

        const actual = geo.resolveCity(location);

        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, CA', () => {
        const location = { city: 'Los Angeles', state: 'CA' };

        const expected = {
            csc: {
                city: 'Los Angeles',
                country: 'United States',
                countryCode: 'US',
                state: 'California',
                stateCode: 'CA',
                timezone: 'America/Los_Angeles'
            },
            city: { name: 'Los Angeles', code: null, source: 'input' },
            state: { name: 'California', code: 'CA', source: 'input' },
            country: { name: 'United States', code: 'US', source: 'inferred' },
            complete: true
        }

        const actual = geo.resolveCity(location);

        assert.deepEqual(actual, expected);
    });


    test('Los Angeles, CA, US', () => {
        const location = { city: 'Los Angeles', country: 'US', state: 'CA' };

        const expected = {
            csc: {
                city: 'Los Angeles',
                country: 'United States',
                countryCode: 'US',
                state: 'California',
                stateCode: 'CA',
                timezone: 'America/Los_Angeles'
            },
            city: { name: 'Los Angeles', code: null, source: 'input' },
            state: { name: 'California', code: 'CA', source: 'input' },
            country: { name: 'United States', code: 'US', source: 'input' },
            complete: true
        }

        const actual = geo.resolveCity(location);

        assert.deepEqual(actual, expected);
    });

    test('(none), HK, CN', () => {
        const location = { country: 'CN', state: 'HK' };

        const expected = {
            csc: {
                city: null,
                country: 'China',
                countryCode: 'CN',
                state: 'Hong Kong SAR',
                stateCode: 'HK',
                timezone: null
            },
            city: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: { name: 'Hong Kong SAR', code: 'HK', source: 'input' },
            country: { name: 'China', code: 'CN', source: 'input' },
            complete: false
        }

        const actual = geo.resolveCity(location);

        assert.deepEqual(actual, expected);
    });

    test('Houston, (none), US', () => {
        const location = { country: 'US', city: 'Houston' };

        const expected = {
            csc: {
                city: 'Houston',
                country: 'United States',
                countryCode: 'US',
                state: null,
                stateCode: null,
                timezone: null
            },
            city: {
                name: 'Houston',
                code: null,
                source: 'input',
                errors: [
                    {
                        code: 'ambiguous',
                        message: 'Ambiguous: Houston (5 matches in US)'
                    },
                    {
                        code: 'missing',
                        message: 'City is required or must be inferred'
                    }
                ]
            },
            state: {
                name: null,
                code: null,
                source: null,
                errors: [
                    {
                        code: 'missing',
                        message: 'State could not be inferred from city'
                    }
                ]
            },
            country: { name: 'United States', code: 'US', source: 'input' },
            complete: false
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });



    test('Malacca', () => {
        const location = { city: 'Malacca' };

        const expected = {
            city: {
                code: null,
                name: 'Malacca',
                source: 'input'
            },
            complete: true,
            country: {
                code: 'MY',
                name: 'Malaysia',
                source: 'inferred'
            },
            csc: {
                city: 'Malacca',
                country: 'Malaysia',
                countryCode: 'MY',
                state: 'Melaka',
                stateCode: '04',
                timezone: 'Asia/Kuala_Lumpur'
            },
            state: {
                code: '04',
                name: 'Melaka',
                source: 'inferred'
            }
        }

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

    test('Kyoto', () => {
        const location = { city: 'Kyoto' };

        const expected = {
            city: { name: 'Kyoto', code: null, source: 'input' },
            state: { name: 'Kyoto', code: '26', source: 'inferred' },
            country: { name: 'Japan', code: 'JP', source: 'inferred' },
            csc: {
                city: 'Kyoto',
                state: 'Kyoto',
                stateCode: '26',
                country: 'Japan',
                countryCode: 'JP',
                timezone: 'Asia/Tokyo'
            },
            complete: true
        }

        const actual = geo.resolveCity(location);
        // console.dir(actual, { depth: null });
        assert.deepEqual(actual, expected);
    });


    test('Auckland', () => {
        const location = { city: 'Auckland', country: 'NZ' };

        const expected = {
            city: {
                code: null,
                name: 'Auckland',
                source: 'input'
            },
            complete: true,
            country: {
                code: 'NZ',
                name: 'New Zealand',
                source: 'input'
            },
            csc: {
                city: 'Auckland',
                country: 'New Zealand',
                countryCode: 'NZ',
                state: 'Auckland',
                stateCode: 'AUK',
                timezone: 'Pacific/Auckland'
            },
            state: {
                code: 'AUK',
                name: 'Auckland',
                source: 'inferred'
            }
        };

        const actual = geo.resolveCity(location);
        assert.deepEqual(actual, expected);
    });

};
