const { cities } = require('city-state-country');

module.exports = () => (lat, lng) => {

    if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
    }

    const toRad = deg => deg * Math.PI / 180;
    const latRad = toRad(lat);
    const lngRad = toRad(lng);

    let closest = null;
    let minA = Infinity;

    for (const city of cities) {
        const cityLatRad = toRad(city.lat);
        const cityLngRad = toRad(city.lng);
        const a = fastHaversineA(latRad, lngRad, cityLatRad, cityLngRad);

        if (a < minA) {
            minA = a;
            closest = city;
        }
    }

    if (!closest) return null;

    const distanceKm = 6371 * 2 * Math.asin(Math.sqrt(minA)); // actual distance (only once)

    return {
        lat,
        lng,
        city: closest.name,
        state: closest.state,
        'state.iso': closest.stateCode,
        country: closest.country,
        'country.iso2': closest.countryCode,
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
