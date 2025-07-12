module.exports = ({ test, assert }) => $ => {

    test('Distance in km', () => {
        assert.equal($.geo.haversineDistanceKm(-37.7993, 144.9564, -37.7993, 144.9564), 0);
        assert.equal($.geo.haversineDistanceKm(-37.7993, 144.9564, 34.8365, 134.6933), 8145.88424433472);
    });

};


