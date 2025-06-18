module.exports = ({ test, assert }) => ({ geo }) => {

    test('Globally unique city', () => {
        const input = { city: 'Canberra' };

        const expected = {
            city: 'Canberra',
            state: 'Australian Capital Territory',
            'state.iso': 'ACT',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + state', () => {
        const input = { city: 'Melbourne', state: 'VIC' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + default country', () => {
        const input = { city: 'Melbourne' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique city + country', () => {
        const input = { city: 'Melbourne', country: 'AU' };

        const expected = {
            city: 'Melbourne',
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally unique state', () => {
        const input = { state: 'ACT' };

        const expected = {
            city: undefined,
            state: 'Australian Capital Territory',
            'state.iso': 'ACT',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique state + country', () => {
        const input = { state: 'Victoria', country: 'AU' };

        const expected = {
            city: undefined,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

    test('Globally non-unique state + default country', () => {
        const input = { state: 'Victoria' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            city: undefined,
            state: 'Victoria',
            'state.iso': 'VIC',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Globally unique country (countries should be inherently unique)', () => {
        const input = { country: 'AU' };

        const expected = {
            city: undefined,
            state: undefined,
            'state.iso': undefined,
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
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

        const actual = geo.lookupRegion(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, CA', () => {
        const location = { city: 'Los Angeles', state: 'CA' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            errors: [
                'City and state cannot be uniquely identified: Los Angeles, CA'
            ]
        }

        const actual = geo.lookupRegion(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, (missing), US', () => {
        const location = { city: 'Los Angeles', country: 'US' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            'country.iso2': 'US',
            'state.iso': 'CA',
            city: 'Los Angeles',
            country: 'United States',
            state: 'California'
        }

        const actual = geo.lookupRegion(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

    test('Los Angeles, CA, US', () => {
        const location = { city: 'Los Angeles', country: 'US', state: 'CA' };
        const defaultLocation = { country: 'AU' };

        const expected = {
            'country.iso2': 'US',
            'state.iso': 'CA',
            city: 'Los Angeles',
            country: 'United States',
            state: 'California'
        }

        const actual = geo.lookupRegion(location, defaultLocation);
        assert.deepEqual(actual, expected);
    });

};
