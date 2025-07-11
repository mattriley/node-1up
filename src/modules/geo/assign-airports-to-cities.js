const fs = require('fs');
const path = require('path');

module.exports = ({ self }) => async ({
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
            distanceKm: Math.round(self.haversine(latitude, longitude, airport.latitude, airport.longitude) * 10) / 10
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
