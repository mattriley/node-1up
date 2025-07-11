const fs = require('fs');
const path = require('path');

// Haversine formula to compute distance between two lat/lng points (in km)
function haversine(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = () => async ({
    cities,
    airports: airportsRaw,
    outputFile,
    outputDir,
    maxDistanceKm = 100,
    maxAirportsPerCity = 3
} = {}) => {
    const airports = airportsRaw.filter(
        a => a.iata && a.iata.length === 3 && a.latitude && a.longitude
    );

    const enriched = cities.map(city => {
        const { latitude, longitude } = city;

        const airportsWithDistance = airports.map(airport => ({
            iata: airport.iata,
            name: airport.name,
            type: airport.type,
            distanceKm: Math.round(haversine(latitude, longitude, airport.latitude, airport.longitude) * 10) / 10
        }));

        const nearbyAirports = airportsWithDistance
            .filter(a => a.distanceKm <= maxDistanceKm)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, maxAirportsPerCity);

        const nearestLarge = nearbyAirports.find(a => a.type === 'large_airport');

        return {
            ...city,
            nearbyAirports: nearbyAirports.length > 0 ? nearbyAirports : null,
            iata: nearestLarge?.iata ?? null
        };
    });

    let finalOutputPath = null;
    if (outputFile) {
        finalOutputPath = outputFile;
    } else if (outputDir) {
        finalOutputPath = path.join(outputDir, 'cities-with-iata.json');
    }

    if (finalOutputPath) {
        fs.writeFileSync(finalOutputPath, JSON.stringify(enriched, null, 2), 'utf-8');
        console.log(`✅ Enriched ${enriched.length} cities → ${finalOutputPath}`);
    }

    return enriched;
};
