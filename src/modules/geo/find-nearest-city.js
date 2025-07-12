module.exports = ({ self, config }) => ({ latitude, longitude }) => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        console.warn(latitude, longitude);
        throw new Error('Latitude and longitude must be numbers');
    }

    let closest = null;
    let distanceKm = Infinity;

    for (const city of config.locationData.cities) {
        const a = self.haversine(latitude, longitude, city.latitude, city.longitude); // use degrees
        if (a < distanceKm) {
            distanceKm = a;
            closest = city;
        }
    }

    if (!closest) return null;

    const cityData = closest;
    const stateData = closest.stateCode ? self.finder.findState(closest.stateCode, closest.countryCode) : {};
    const countryData = self.finder.findCountry(closest.countryCode);

    return self.buildResult(cityData, stateData, countryData, { latitude, longitude, distanceKm });
};
