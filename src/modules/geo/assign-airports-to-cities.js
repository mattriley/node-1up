const fs = require('fs');
const path = require('path');

module.exports = ({ self }) => async ({
    countries,
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

    const countriesByCode = _.keyBy(countries, country => country.isoCode.toLowerCase());

    const enriched = cities.map(city => {
        const { latitude, longitude } = city;

        const airportsWithDistance = airports.map(airport => ({
            // iata: airport.iata,
            // name: airport.name,
            // city: airport.city,
            // type: airport.type,
            ...airport,
            distanceKm: Math.round(self.haversine(latitude, longitude, airport.latitude, airport.longitude) * 10) / 10
        }));

        const nearbyAirports = airportsWithDistance
            .filter(a => a.distanceKm <= maxDistanceKm)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, maxAirportsPerCity);

        // const international = nearbyAirports.find(ap => ap.name.includes('International'));

        const matches = nearbyAirports.filter(ap => {
            if (!ap.city) return;
            return ap.city.toLowerCase() === city.name.toLowerCase() &&
                ap.country.toLowerCase() === countriesByCode[city.countryCode.toLowerCase()].name.toLowerCase();
        });

        let iataCode = matches[0]

        if (matches.length > 1) {
            const match = matches.find(ap => ap.city.toLowerCase().startsWith(ap.iata.toLowerCase()));
            if (match) iataCode = match.iata;
        }

        const nearbyAirports2 = nearbyAirports.map(ap => {
            return _.pick(ap, ['iata', 'name', 'distanceKm']);
        });

        return {
            ...city,
            nearbyAirports: nearbyAirports2.length > 0 ? nearbyAirports2 : null,
            iataCode
        };
    });

    let finalOutputPath = null;
    if (outputFile) {
        finalOutputPath = outputFile;
    } else if (outputDir) {
        finalOutputPath = path.join(outputDir, 'cities.json');
    }

    if (finalOutputPath) {
        fs.writeFileSync(finalOutputPath, JSON.stringify(enriched, null, 2), 'utf-8');
        console.log(`✅ Enriched ${enriched.length} cities → ${finalOutputPath}`);
    }

    return enriched;
};
