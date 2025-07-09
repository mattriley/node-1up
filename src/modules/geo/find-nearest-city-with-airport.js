function fastHaversineA(lat1Rad, lon1Rad, lat2Rad, lon2Rad) {
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    return (
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2
    );
};

module.exports = ({ self, config }) => {

    const cities = config.iataCities;

    return (lat, lng) => {
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error('Latitude and longitude must be numbers');
        }

        const toRad = deg => deg * Math.PI / 180;
        const latRad = toRad(lat);
        const lngRad = toRad(lng);

        let closest = null;
        let minA = Infinity;

        for (const city of cities) {
            const cityLatRad = toRad(Number(city.latitude));
            const cityLngRad = toRad(Number(city.longitude));
            const a = fastHaversineA(latRad, lngRad, cityLatRad, cityLngRad);

            if (a < minA) {
                minA = a;
                closest = city;
            }
        }

        if (!closest) return null;

        const distanceKm = 6371 * 2 * Math.asin(Math.sqrt(minA));

        const cityData = closest;
        const stateData = self.locationData.lookup.state[closest.stateCode];
        const countryData = self.locationData.lookup.country[closest.countryCode];

        return self.buildResult(cityData, stateData, countryData, { lat, lng, distanceKm });
    }

};
