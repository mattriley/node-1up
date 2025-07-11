module.exports = ({ self, config }) => ({ latitude, longitude }) => {

    const lat = latitude;
    const lng = longitude;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
        console.warn(lat, lng)
        throw new Error('Latitude and longitude must be numbers');
    }

    const toRad = deg => deg * Math.PI / 180;
    const latRad = toRad(lat);
    const lngRad = toRad(lng);

    let closest = null;
    let minA = Infinity;

    for (const city of config.locationData.cities) {
        const cityLatRad = toRad(Number(city.latitude));
        const cityLngRad = toRad(Number(city.longitude));
        const a = self.haversine(latRad, lngRad, cityLatRad, cityLngRad);

        if (a < minA) {
            minA = a;
            closest = city;
        }
    }

    if (!closest) return null;

    const distanceKm = 6371 * 2 * Math.asin(Math.sqrt(minA));

    const cityData = closest;
    const stateData = closest.stateCode ? self.finder.findState(closest.stateCode, closest.countryCode) : {};
    const countryData = self.finder.findCountry(closest.countryCode);
    return self.buildResult(cityData, stateData, countryData, { latitude, longitude, distanceKm });

};
