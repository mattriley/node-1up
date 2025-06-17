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

};
