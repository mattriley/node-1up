module.exports = ({ test, assert }) => ({ geo }) => {

    test('SYD IATA code', () => {
        const expected = {
            continent: 'OC',
            iata: 'SYD',
            iso: 'AU',
            lat: '-33.932922',
            lon: '151.1799',
            name: 'Sydney Kingsford Smith International Airport',
            size: 'large',
            status: 1,
            type: 'airport'
        }
        const actual = geo.findAirport('syd');
        assert.deepEqual(actual, expected);
    });

};
