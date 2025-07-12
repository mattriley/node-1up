module.exports = ({ self, config }) => ({ latitude, longitude }) => {

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        console.warn('Invalid input coordinates:', latitude, longitude);
        throw new Error('Latitude and longitude must be valid numbers');
    }

    let closestCity = null;
    let shortestDistance = Infinity;

    for (const city of config.locationData.cities) {
        const distanceKm = self.haversineDistanceKm(
            latitude,
            longitude,
            city.latitude,
            city.longitude
        );

        if (distanceKm < shortestDistance) {
            shortestDistance = distanceKm;
            closestCity = city;
        }
    }

    if (!closestCity) return null;

    //  State not found: 00; Country: SG

    const cityData = closestCity;

    let stateData;

    try {
        if (cityData.stateCode) {
            stateData = self.finder.findState(cityData.stateCode, cityData.countryCode);
        }
    } catch (err) {
        if (cityData.state) {
            stateData = self.finder.findState(cityData.state, cityData.countryCode);
        }
    }

    const countryData = self.finder.findCountry(cityData.countryCode);

    return self.buildResult(cityData, stateData, countryData, {
        'city.latitude': cityData.latitude,
        'city.longitude': cityData.longitude,
        latitude,
        longitude,
        distanceKm: shortestDistance
    });

};
