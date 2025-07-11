module.exports = ({ self, config }) => {

    return (lat, lng) => {
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
        const stateData = config.locationData.lookup.states[closest.stateCode.toLowerCase()];
        const countryData = config.locationData.lookup.countries[closest.countryCode.toLowerCase()];

        return self.buildResult(cityData, stateData, countryData, { lat, lng, distanceKm });
    }

};
