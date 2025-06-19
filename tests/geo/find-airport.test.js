module.exports = ({ test, assert }) => ({ geo }) => {

    test('SYD IATA code', () => {
        const expected = {
            iata: 'SYD',
            icao: 'YSSY',
            name: 'Sydney Airport (Kingsford Smith Airport)',
            city: 'Sydney',
            state: 'New South Wales',
            country: 'Australia'
        };
        const actual = geo.findAirport('syd');
        assert.deepEqual(actual, expected);
    });

};
