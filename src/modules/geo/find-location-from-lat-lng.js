module.exports = ({ self }) => (lat, lng) => {

    const cities = require('../../data/cities.json');

    if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
    }

    const toRad = deg => deg * Math.PI / 180;
    const latRad = toRad(lat);
    const lngRad = toRad(lng);

    let closest = null;
    let minA = Infinity;

    for (const city of cities) {
        const cityLatRad = toRad(city.latitude);
        const cityLngRad = toRad(city.longitude);
        const a = fastHaversineA(latRad, lngRad, cityLatRad, cityLngRad);

        if (a < minA) {
            minA = a;
            closest = city;
        }
    }

    if (!closest) return null;

    const distanceKm = 6371 * 2 * Math.asin(Math.sqrt(minA)); // actual distance (only once)

    const location = self.findLocation({
        city: closest.name,
        state: closest.stateCode,
        country: closest.countryCode
    });

    return {
        ...location,
        lat,
        lng,
        distanceKm
    };
}

function fastHaversineA(lat1Rad, lon1Rad, lat2Rad, lon2Rad) {
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    return (
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2
    );
}
