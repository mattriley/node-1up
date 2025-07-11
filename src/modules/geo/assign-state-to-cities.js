module.exports = ({ self }) => ({ cities, states }) => {

    return cities.map(city => {
        const candidates = states.filter(s => s.countryCode === city.countryCode);
        if (!candidates.length) return city;

        let nearest = null;
        let minDistance = Infinity;

        for (const state of candidates) {
            const dist = self.haversine(
                city.latitude, city.longitude,
                parseFloat(state.latitude), parseFloat(state.longitude)
            );
            if (dist < minDistance) {
                minDistance = dist;
                nearest = state;
            }
        }

        return {
            ...city,
            stateCode: nearest?.isoCode || null
        };
    });

};
