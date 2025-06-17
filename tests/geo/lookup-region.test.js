module.exports = ({ test, assert }) => ({ geo }) => {

    test('Unique city', () => {
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

    test('Unique state', () => {
        const input = { state: 'ACT' };

        const expected = {
            city: null,
            state: 'Australian Capital Territory',
            'state.iso': 'ACT',
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

    test('Unique country', () => {
        const input = { country: 'AU' };

        const expected = {
            city: null,
            state: null,
            'state.iso': null,
            country: 'Australia',
            'country.iso2': 'AU'
        };

        const actual = geo.lookupRegion(input);
        assert.deepEqual(actual, expected);
    });

};
